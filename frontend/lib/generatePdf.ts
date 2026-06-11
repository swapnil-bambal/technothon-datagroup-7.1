import type { jsPDF } from "jspdf";
import type { NdaDocument } from "./buildNdaDocument";

// Renders the completed NDA into a jsPDF document and triggers a download.
//
// The layout (`renderNdaToPdf`) is split from the download (`generateNdaPdf`)
// so the page-building logic can be unit-tested in Node by passing in a jsPDF
// instance, while the app keeps loading jsPDF lazily in the browser (it touches
// `window`, so it must not run on the server).

type FontStyle = "normal" | "bold" | "italic";

/** Lay the NDA out onto an existing jsPDF instance (a4, millimetre units). */
export function renderNdaToPdf(pdf: jsPDF, document: NdaDocument): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Convert a point font size to a millimetre line height (pt -> mm is /2.835).
  const lineHeight = (size: number) => (size / 2.835) * 1.2;

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  }

  function writeText(
    content: string,
    opts: {
      size?: number;
      style?: FontStyle;
      align?: "left" | "center";
      indent?: number;
    } = {},
  ) {
    const size = opts.size ?? 10.5;
    const style = opts.style ?? "normal";
    const indent = opts.indent ?? 0;
    pdf.setFont("times", style);
    pdf.setFontSize(size);
    const split = pdf.splitTextToSize(content, contentWidth - indent);
    const lines: string[] = Array.isArray(split) ? split : [split];
    const lh = lineHeight(size);
    for (const line of lines) {
      ensureSpace(lh);
      if (opts.align === "center") {
        pdf.text(line, pageWidth / 2, y, { align: "center" });
      } else {
        pdf.text(line, margin + indent, y);
      }
      y += lh;
    }
  }

  function gap(mm = 3) {
    if (y + mm > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    } else {
      y += mm;
    }
  }

  // --- Title + intro -------------------------------------------------------
  writeText(document.title, { size: 18, style: "bold", align: "center" });
  gap(4);
  writeText(document.intro, { size: 10.5 });
  gap(5);

  // --- Cover page ----------------------------------------------------------
  writeText("Cover Page", { size: 13, style: "bold" });
  gap(2);
  for (const field of document.coverFields) {
    writeText(field.label, { size: 10.5, style: "bold" });
    writeText(field.value, { size: 10.5, indent: 4 });
    gap(2);
  }

  gap(2);
  writeText(document.executionNote, { size: 10, style: "italic" });
  gap(3);

  for (const party of document.parties) {
    ensureSpace(lineHeight(11) * 6);
    writeText(`${party.label}: ${party.company}`, {
      size: 11,
      style: "bold",
    });
    writeText(`Print Name: ${party.signatoryName}`, { size: 10.5, indent: 4 });
    writeText(`Title: ${party.title}`, { size: 10.5, indent: 4 });
    writeText(`Notice Address: ${party.noticeAddress}`, {
      size: 10.5,
      indent: 4,
    });
    writeText("Signature: ______________________      Date: ______________", {
      size: 10.5,
      indent: 4,
    });
    gap(4);
  }

  // --- Standard Terms (start on a fresh page) ------------------------------
  pdf.addPage();
  y = margin;
  writeText(document.termsTitle, { size: 14, style: "bold", align: "center" });
  gap(4);
  for (const section of document.sections) {
    ensureSpace(lineHeight(11) * 3);
    writeText(`${section.number}. ${section.title}`, {
      size: 11,
      style: "bold",
    });
    gap(1);
    for (const paragraph of section.paragraphs) {
      writeText(paragraph, { size: 10.5 });
      gap(1.5);
    }
    gap(2);
  }

  gap(4);
  writeText(document.attribution, { size: 8, style: "italic" });

  // --- Page numbers --------------------------------------------------------
  const totalPages = pdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setFont("times", "normal");
    pdf.setFontSize(8);
    pdf.text(`Page ${page} of ${totalPages}`, pageWidth / 2, pageHeight - 8, {
      align: "center",
    });
  }
}

/**
 * Generate a clean, text-based PDF of the completed NDA and download it. jsPDF
 * is imported dynamically so it only loads in the browser.
 */
export async function generateNdaPdf(
  document: NdaDocument,
  fileBaseName: string,
): Promise<void> {
  const { jsPDF: JsPDF } = await import("jspdf");
  const pdf = new JsPDF({ unit: "mm", format: "a4" });
  renderNdaToPdf(pdf, document);
  pdf.save(`${fileBaseName}.pdf`);
}
