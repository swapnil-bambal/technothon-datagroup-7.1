# Testing — Mutual NDA Creator

## Automated tests

### Unit + component (Vitest + Testing Library, jsdom)

```bash
cd frontend
npm install
npm test          # run once
npm run test:watch
```

Covers:

| File | What it checks |
| --- | --- |
| `tests/buildNdaDocument.test.ts` | Term/date/filename helpers; that entered values land in the cover page and are woven into Standard Terms §5 (Effective Date) and §9 (Governing Law, Jurisdiction); bracketed placeholders for empty fields; MNDA term / confidentiality choices. |
| `tests/generatePdf.test.ts` | `renderNdaToPdf` produces a valid (`%PDF-`), multi-page document for a filled NDA and does not throw on an empty one. This exercises the real jsPDF layout path in Node. |
| `tests/DownloadPdfButton.test.tsx` | Clicking calls `generateNdaPdf` with the document + filename; a generation failure surfaces in an `aria-live` status region. |
| `tests/NdaCreator.test.tsx` | Typing a company name and governing law updates the live preview; toggling "In perpetuity" updates the document. |

### End-to-end (Playwright, real browser)

```bash
cd frontend
npx playwright install chromium   # one-time
npm run test:e2e
```

`e2e/nda.spec.ts` loads the app, fills the form, asserts the live preview
updates, clicks **Download PDF**, and asserts a `.pdf` download is produced.

> Note: the e2e suite requires a browser download (~chromium). It is wired up
> and runnable locally/CI; if your environment can't install browsers, the
> Vitest suite above already validates the PDF bytes directly via
> `renderNdaToPdf`.

## Manual test checklist

Run `npm run dev` and open http://localhost:3000.

| # | Area | Steps | Expected |
| --- | --- | --- | --- |
| 1 | Initial render | Load the page | Form on the left, document preview on the right; empty fields show bracketed placeholders (e.g. `[Company name]`, `[State]`). |
| 2 | Live preview | Type Party 1 / Party 2 company, signatory, title, notice address | Each value appears in the corresponding signature block in the preview as you type. |
| 3 | Purpose | Edit the Purpose text | Cover Page "Purpose" updates. |
| 4 | Effective date | Pick a date | Cover Page shows it formatted (e.g. "March 1, 2026") and §5 of the Standard Terms references the same date. |
| 5 | Governing law / jurisdiction | Enter "Delaware" / "New Castle County, Delaware" | §9 reads "laws of the State of Delaware" and "courts located in New Castle County, Delaware". |
| 6 | MNDA term toggle | Select "Continues until terminated" | Years input disables; Cover Page "MNDA Term" switches text. Select "Expires" and change the number → text updates. |
| 7 | Confidentiality toggle | Select "In perpetuity" | Years input disables; Cover Page shows "In perpetuity." |
| 8 | Number input | Clear the years field and retype a multi-digit value (e.g. 12) | Field can be cleared and accepts multi-digit input without snapping back; on blur an empty value normalizes to 1. |
| 9 | Download PDF | Click **Download PDF** | A `Mutual-NDA[-Party1-and-Party2].pdf` downloads; opening it shows the cover page, signature blocks, full Standard Terms, and "Page X of Y" footers; entered values are present. |
| 10 | Empty download | Click **Download PDF** with a blank form | A valid PDF still downloads, using bracketed placeholders. |
| 11 | Responsive | Narrow the window to mobile width | Form and preview stack into a single column; no overflow. |
| 12 | Accessibility | Tab through the form; use a screen reader | Every input is labelled; the two term groups announce as labelled radio groups (`fieldset`/`legend`); the download error (if any) is announced via the live region. |
| 13 | Special characters | Enter names with `&`, accents, quotes | Render correctly in both the preview and the PDF. |
