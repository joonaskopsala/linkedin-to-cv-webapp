import { NextRequest, NextResponse } from "next/server";
import {
  parsePdfToProfile,
  isLinkedInPdf,
} from "../../../lib/linkedinPdfParser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 },
      );
    }

    // Validate file size (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File is too large (max 10MB)" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Check PDF magic bytes
    if (!(buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44)) {
      return NextResponse.json(
        { error: "File is not a valid PDF" },
        { status: 400 },
      );
    }

    // Parse PDF to profile
    const profile = await parsePdfToProfile(buffer);

    // Validate it looks like a LinkedIn export
    const profileText = JSON.stringify(profile).toLowerCase();
    if (!isLinkedInPdf(profileText)) {
      return NextResponse.json(
        {
          error:
            "This doesn't look like a LinkedIn profile export. " +
            "Please download your profile PDF from LinkedIn (Me → Settings & Privacy → " +
            "Data privacy → Get a copy of your data, or use the Save to PDF button on your profile).",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("PDF parsing error:", error);

    let errorMessage = "Failed to parse PDF";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// Allow OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
