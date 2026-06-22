# LinkedIn → CV (Next.js + Material UI)

This workspace contains a starter Next.js app scaffolded to match the provided product plan and guide. It includes a placeholder PDF upload UI and a Material UI based preview.

Quick start

1. Install dependencies (using `pnpm`):

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm run dev
```

Open http://localhost:3000 to view the app.

Notes

- PDF parsing is not implemented yet. Add your LinkedIn PDF parser logic in `components/UploadParser.tsx` and remove or replace the placeholder UI.
- Templates and editing features described in the product plan are scaffolded; next steps are implementing full editors, cloud save, and Pro gating.
