"use client";

import { useState } from "react";
import type { NdaDocument } from "@/lib/buildNdaDocument";
import { generateNdaPdf } from "@/lib/generatePdf";

interface DownloadPdfButtonProps {
  ndaDocument: NdaDocument;
  fileBaseName: string;
}

export default function DownloadPdfButton({
  ndaDocument,
  fileBaseName,
}: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setError(null);
    setIsGenerating(true);
    try {
      await generateNdaPdf(ndaDocument, fileBaseName);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      setError("Sorry, the PDF could not be generated. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        aria-busy={isGenerating}
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating ? "Generating…" : "Download PDF"}
      </button>
      <div role="status" aria-live="polite" aria-atomic="true">
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
