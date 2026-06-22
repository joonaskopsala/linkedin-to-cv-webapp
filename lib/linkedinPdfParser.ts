// `pdf-parse` is required dynamically inside `extractTextFromPdf` to avoid
// Next.js dev/server bundler rewriting the worker import paths. We perform
// runtime require/import so the module is loaded only on the Node server.

export interface ProfileData {
  name?: string;
  headline?: string;
  location?: string;
  email?: string;
  linkedInUrl?: string;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  languages?: string[];
  profilePhotoBase64?: string;
}

export interface Experience {
  company?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  bullets?: string[];
}

export interface Education {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Extract text from all pages of a PDF
 */
async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  try {
    // Dynamically require pdf-parse at runtime to avoid Next.js bundler rewriting worker imports
    // Use eval('require') to prevent static analysis/ bundling.
    // @ts-ignore
    const req: NodeRequire = eval("require");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParsePkg: any = req("pdf-parse");

    const PDFParseClass: any =
      pdfParsePkg?.PDFParse ||
      pdfParsePkg?.default?.PDFParse ||
      pdfParsePkg?.default ||
      pdfParsePkg;

    // Try to set a packaged worker path if available to avoid dynamic dev imports
    try {
      if (typeof PDFParseClass?.setWorker === "function") {
        try {
          const workerPath = req.resolve(
            "pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs",
          );
          PDFParseClass.setWorker(workerPath);
        } catch (e) {
          // ignore resolution failures and let PDFParse decide
        }
      }
    } catch (e) {
      // ignore
    }

    const parser = new PDFParseClass({ data: pdfBuffer });
    const result = await parser.getText();
    if (typeof parser.destroy === "function") {
      await parser.destroy();
    }
    return result.text ?? "";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}

/**
 * Split extracted text into sections
 */
function splitIntoSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const sectionHeaders = [
    "Contact",
    "Experience",
    "Education",
    "Skills",
    "Languages",
    "Summary",
    "About",
  ];

  let currentSection = "Contact";
  const lines = text.split("\n");
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if this line is a section header
    const isHeader = sectionHeaders.some(
      (header) =>
        trimmedLine.toLowerCase() === header.toLowerCase() ||
        trimmedLine.toLowerCase() === header.toLowerCase() + "information",
    );

    if (isHeader && trimmedLine) {
      // Save previous section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join("\n").trim();
      }
      currentSection = trimmedLine;
      currentContent = [];
    } else if (trimmedLine !== "---PAGE_BREAK---" && trimmedLine) {
      currentContent.push(trimmedLine);
    }
  }

  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join("\n").trim();
  }

  return sections;
}

/**
 * Parse contact information
 */
function parseContact(contactText: string): Partial<ProfileData> {
  const result: Partial<ProfileData> = {};

  // Extract email
  const emailMatch = contactText.match(
    /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
  );
  if (emailMatch) {
    result.email = emailMatch[1];
  }

  // Extract LinkedIn URL
  const linkedInMatch = contactText.match(
    /(https?:\/\/)?linkedin\.com\/in\/[\w-]+/i,
  );
  if (linkedInMatch) {
    result.linkedInUrl = linkedInMatch[0];
  }

  // Extract name (usually first line if no email/URL)
  const lines = contactText.split("\n").filter((l) => l.trim());
  if (lines.length > 0 && !result.name) {
    const firstLine = lines[0].trim();
    if (!firstLine.includes("@") && !firstLine.includes("linkedin")) {
      result.name = firstLine;
    }
  }

  return result;
}

/**
 * Parse experience section
 */
function parseExperience(experienceText: string): Experience[] {
  const experiences: Experience[] = [];
  const entries = experienceText.split(/\n(?=[A-Z])/); // Split on capitalized lines

  for (const entry of entries) {
    if (!entry.trim()) continue;

    const lines = entry.split("\n").map((l) => l.trim());
    const exp: Experience = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Company and title often come first
      if (i === 0) {
        // Try to parse "Title Company" format
        const parts = line.split(" at ");
        if (parts.length === 2) {
          exp.title = parts[0].trim();
          exp.company = parts[1].trim();
        } else {
          exp.company = line;
        }
      }

      // Dates
      const dateMatch = line.match(/(\w+ \d{4})\s*[-–]\s*(Present|\w+ \d{4})/);
      if (dateMatch) {
        exp.startDate = dateMatch[1];
        exp.endDate = dateMatch[2];
        exp.isCurrent = dateMatch[2].toLowerCase() === "present";
      }

      // Bullets (usually indented or start with •)
      if (line.startsWith("•") || line.startsWith("-")) {
        if (!exp.bullets) {
          exp.bullets = [];
        }
        exp.bullets.push(line.replace(/^[•-]\s*/, ""));
      }
    }

    if (exp.company || exp.title) {
      experiences.push(exp);
    }
  }

  return experiences;
}

/**
 * Parse education section
 */
function parseEducation(educationText: string): Education[] {
  const educations: Education[] = [];
  const entries = educationText.split(/\n(?=[A-Z])/);

  for (const entry of entries) {
    if (!entry.trim()) continue;

    const lines = entry.split("\n").map((l) => l.trim());
    const edu: Education = {};

    for (const line of lines) {
      // School (usually first substantial line)
      if (!edu.school && line.length > 0 && !line.includes(",")) {
        edu.school = line;
      }

      // Degree and field
      const degreeMatch = line.match(
        /^(.*?)(Degree|B\.S\.|B\.A\.|M\.S\.|M\.B\.A\.|Ph\.D\.)/i,
      );
      if (degreeMatch) {
        edu.degree = degreeMatch[2];
        edu.fieldOfStudy = degreeMatch[1].replace(/,\s*$/, "").trim();
      }

      // Dates
      const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4})/);
      if (dateMatch) {
        edu.startDate = dateMatch[1];
        edu.endDate = dateMatch[2];
      }
    }

    if (edu.school) {
      educations.push(edu);
    }
  }

  return educations;
}

/**
 * Parse skills section
 */
function parseSkills(skillsText: string): string[] {
  const lines = skillsText.split("\n").map((l) => l.trim());
  const skills: string[] = [];

  for (const line of lines) {
    if (line && line.length > 0) {
      // Split by common delimiters
      const skillSet = line.split(/[,•;]/);
      for (const skill of skillSet) {
        const trimmed = skill.trim();
        if (trimmed && trimmed.length > 0 && trimmed.length < 100) {
          skills.push(trimmed);
        }
      }
    }
  }

  return [...new Set(skills)]; // Remove duplicates
}

/**
 * Main function to parse LinkedIn PDF to profile
 */
export async function parsePdfToProfile(
  pdfBuffer: Buffer,
): Promise<ProfileData> {
  // Validate PDF
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("PDF buffer is empty");
  }

  // Check for PDF magic bytes
  if (
    !(pdfBuffer[0] === 0x25 && pdfBuffer[1] === 0x50 && pdfBuffer[2] === 0x44)
  ) {
    throw new Error("File is not a valid PDF");
  }

  // Extract text from PDF
  let fullText: string;
  try {
    fullText = await extractTextFromPdf(pdfBuffer);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not extract text from PDF: ${message}`);
  }

  // Split into sections
  const sections = splitIntoSections(fullText);

  // Parse each section
  const profile: ProfileData = {};

  // Contact info
  if (sections["Contact"] || sections["Contact Information"]) {
    Object.assign(
      profile,
      parseContact(sections["Contact"] || sections["Contact Information"]),
    );
  }

  // Experience
  if (sections["Experience"]) {
    profile.experience = parseExperience(sections["Experience"]);
  }

  // Education
  if (sections["Education"]) {
    profile.education = parseEducation(sections["Education"]);
  }

  // Skills
  if (sections["Skills"]) {
    profile.skills = parseSkills(sections["Skills"]);
  }

  // Languages
  if (sections["Languages"]) {
    profile.languages = parseSkills(sections["Languages"]);
  }

  // Summary
  if (sections["Summary"] || sections["About"]) {
    profile.summary = (sections["Summary"] || sections["About"]).substring(
      0,
      500,
    );
  }

  // Validate required fields
  if (!profile.name && !profile.email) {
    throw new Error("Could not extract profile name or email from PDF");
  }

  if (!profile.experience || profile.experience.length === 0) {
    if (!profile.education || profile.education.length === 0) {
      throw new Error(
        "Could not find experience or education information in PDF",
      );
    }
  }

  return profile;
}

/**
 * Validate if PDF is a LinkedIn export
 */
export function isLinkedInPdf(text: string): boolean {
  const linkedInIndicators = [
    "linkedin",
    "experience",
    "education",
    "skills",
    "contact",
  ];

  const textLower = text.toLowerCase();
  let indicatorCount = 0;

  for (const indicator of linkedInIndicators) {
    if (textLower.includes(indicator)) {
      indicatorCount++;
    }
  }

  // At least 3 of these indicators should be present
  return indicatorCount >= 3;
}
