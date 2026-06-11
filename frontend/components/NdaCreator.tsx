"use client";

import { useMemo, useState } from "react";
import { defaultNdaData, type NdaData } from "@/lib/ndaTypes";
import { buildNdaDocument, ndaFileBaseName } from "@/lib/buildNdaDocument";
import NdaForm from "./NdaForm";
import NdaPreview from "./NdaPreview";
import DownloadPdfButton from "./DownloadPdfButton";

export default function NdaCreator() {
  const [data, setData] = useState<NdaData>(defaultNdaData);

  const { ndaDocument, fileBaseName } = useMemo(
    () => ({
      ndaDocument: buildNdaDocument(data),
      fileBaseName: ndaFileBaseName(data),
    }),
    [data],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Enter NDA details
        </h2>
        <NdaForm value={data} onChange={setData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
          <DownloadPdfButton
            ndaDocument={ndaDocument}
            fileBaseName={fileBaseName}
          />
        </div>
        <NdaPreview ndaDocument={ndaDocument} />
      </section>
    </div>
  );
}
