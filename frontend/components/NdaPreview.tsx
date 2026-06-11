"use client";

import type { NdaDocument } from "@/lib/buildNdaDocument";

// Renders the completed NDA as a styled "paper" document. Read-only preview;
// the same NdaDocument drives the PDF export.

export default function NdaPreview({
  ndaDocument,
}: {
  ndaDocument: NdaDocument;
}) {
  return (
    <article
      aria-labelledby="nda-preview-title"
      className="mx-auto max-w-[820px] bg-white px-8 py-10 font-serif text-[13px] leading-relaxed text-slate-800 shadow-sm sm:px-12"
    >
      <h1
        id="nda-preview-title"
        className="text-center text-2xl font-bold text-slate-900"
      >
        {ndaDocument.title}
      </h1>
      <p className="mt-4 text-justify">{ndaDocument.intro}</p>

      <h2 className="mt-8 border-b border-slate-300 pb-1 text-lg font-bold text-slate-900">
        Cover Page
      </h2>
      <dl className="mt-4 space-y-3">
        {ndaDocument.coverFields.map((field) => (
          <div key={field.label}>
            <dt className="font-bold text-slate-900">{field.label}</dt>
            <dd className="ml-4 whitespace-pre-wrap">{field.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 italic text-slate-600">{ndaDocument.executionNote}</p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {ndaDocument.parties.map((party) => (
          <div key={party.label} className="rounded border border-slate-200 p-4">
            <p className="font-bold text-slate-900">
              {party.label}: {party.company}
            </p>
            <p className="mt-2">Print Name: {party.signatoryName}</p>
            <p>Title: {party.title}</p>
            <p className="break-words">Notice Address: {party.noticeAddress}</p>
            <p className="mt-4 text-slate-500">Signature: ______________________</p>
            <p className="mt-2 text-slate-500">Date: ______________</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 border-b border-slate-300 pb-1 text-center text-lg font-bold text-slate-900">
        {ndaDocument.termsTitle}
      </h2>
      <ol className="mt-4 space-y-5">
        {ndaDocument.sections.map((section) => (
          <li key={section.number}>
            <h3 className="font-bold text-slate-900">
              {section.number}. {section.title}
            </h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 60)} className="mt-2 text-justify">
                {paragraph}
              </p>
            ))}
          </li>
        ))}
      </ol>

      <p className="mt-10 border-t border-slate-200 pt-4 text-[11px] italic text-slate-500">
        {ndaDocument.attribution}
      </p>
    </article>
  );
}
