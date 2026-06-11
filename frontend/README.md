# Mutual NDA Creator (PL-3)

A small Next.js prototype for the Prelegal project. A user fills in a few key
details, sees the completed **Mutual Non-Disclosure Agreement** render live, and
downloads it as a PDF.

The document is based on the [Common Paper Mutual NDA (v1.0)](https://commonpaper.com/standards/mutual-nda/1.0/),
used under CC BY 4.0 (see `../templates/`).

## Tech

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **jsPDF** for client-side PDF generation
- 100% client-side — no backend or API required

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

## How it works

- `lib/ndaTypes.ts` — the form data shape (`NdaData`) and its defaults.
- `lib/buildNdaDocument.ts` — turns `NdaData` into a renderer-agnostic
  `NdaDocument` (filled cover page + Common Paper Standard Terms). This is the
  single source of truth shared by the preview and the PDF.
- `lib/generatePdf.ts` — renders an `NdaDocument` to a text-based PDF via jsPDF.
- `components/` — `NdaForm` (inputs), `NdaPreview` (live document), and
  `DownloadPdfButton` (one-click export), composed by `NdaCreator`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
