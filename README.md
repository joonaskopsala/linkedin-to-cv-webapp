# LinkedIn → CV

Convert a LinkedIn profile PDF export into a clean, formatted CV — no sign-up required.

## Stack

- **Next.js** (App Router)
- **Material UI** (MUI v9)
- **pdf-parse** — server-side PDF text extraction
- **TypeScript**

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

1. Go to [LinkedIn Data Export](https://www.linkedin.com/mypreferences/d/download-my-data), request a PDF export of your profile, and download it.
2. Upload the PDF on the home page.
3. The file is sent to the `/api/parse-linkedin-pdf` route which extracts text server-side and parses it into structured profile data.
4. The parsed profile renders as a CV preview in the browser.

## Project structure

```
app/
  layout.tsx          # Root layout (server component)
  providers.tsx       # MUI ThemeProvider (client component)
  page.tsx            # Home page — hero + upload + CV preview
  globals.css
  api/
    parse-linkedin-pdf/
      route.ts        # POST handler — PDF → ProfileData
components/
  LinkedInUpload.tsx  # Drag-and-drop PDF upload card
  CvPreview.tsx       # Structured CV renderer
lib/
  linkedinPdfParser.ts  # PDF text extraction and section parsing
```

## Notes

- PDF parsing is heuristic-based. Quality depends on how LinkedIn formats the PDF export for your locale.
- No data is stored server-side — the parsed profile lives only in the browser session.
