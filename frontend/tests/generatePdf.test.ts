import { describe, it, expect } from "vitest";
import { jsPDF } from "jspdf";
import { renderNdaToPdf } from "@/lib/generatePdf";
import { buildNdaDocument } from "@/lib/buildNdaDocument";
import { defaultNdaData } from "@/lib/ndaTypes";

function pdfHeader(pdf: jsPDF): string {
  const bytes = new Uint8Array(pdf.output("arraybuffer") as ArrayBuffer);
  return String.fromCharCode(...bytes.slice(0, 5));
}

describe("renderNdaToPdf", () => {
  it("produces a valid, multi-page PDF for a filled document", () => {
    const doc = buildNdaDocument({
      ...defaultNdaData,
      party1: { ...defaultNdaData.party1, company: "Acme, Inc." },
      party2: { ...defaultNdaData.party2, company: "Globex LLC" },
      governingLawState: "Delaware",
      jurisdiction: "New Castle County, Delaware",
      effectiveDate: "2026-03-01",
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    renderNdaToPdf(pdf, doc);

    expect(pdfHeader(pdf)).toBe("%PDF-");
    expect(pdf.getNumberOfPages()).toBeGreaterThanOrEqual(2);
    expect(
      new Uint8Array(pdf.output("arraybuffer") as ArrayBuffer).length,
    ).toBeGreaterThan(1000);
  });

  it("does not throw on an all-empty (placeholder) document", () => {
    const doc = buildNdaDocument(defaultNdaData);
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    expect(() => renderNdaToPdf(pdf, doc)).not.toThrow();
    expect(pdfHeader(pdf)).toBe("%PDF-");
  });
});
