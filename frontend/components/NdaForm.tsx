"use client";

import type { NdaData, PartyInfo } from "@/lib/ndaTypes";

interface NdaFormProps {
  value: NdaData;
  onChange: (next: NdaData) => void;
}

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";
const labelClass = "block text-sm font-medium text-slate-700";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function PartyFields({
  title,
  party,
  onChange,
}: {
  title: string;
  party: PartyInfo;
  onChange: (next: PartyInfo) => void;
}) {
  const set = (partial: Partial<PartyInfo>) => onChange({ ...party, ...partial });
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <Field label="Company">
        <input
          className={inputClass}
          type="text"
          value={party.company}
          placeholder="Acme, Inc."
          onChange={(e) => set({ company: e.target.value })}
        />
      </Field>
      <Field label="Signatory name">
        <input
          className={inputClass}
          type="text"
          value={party.signatoryName}
          placeholder="Jane Doe"
          onChange={(e) => set({ signatoryName: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <input
          className={inputClass}
          type="text"
          value={party.title}
          placeholder="Chief Executive Officer"
          onChange={(e) => set({ title: e.target.value })}
        />
      </Field>
      <Field label="Notice address (email or postal)">
        <input
          className={inputClass}
          type="text"
          value={party.noticeAddress}
          placeholder="legal@acme.com"
          onChange={(e) => set({ noticeAddress: e.target.value })}
        />
      </Field>
    </div>
  );
}

export default function NdaForm({ value, onChange }: NdaFormProps) {
  const set = (partial: Partial<NdaData>) => onChange({ ...value, ...partial });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Mutual NDA details"
    >
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">
          The Parties
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <PartyFields
            title="Party 1"
            party={value.party1}
            onChange={(party1) => set({ party1 })}
          />
          <PartyFields
            title="Party 2"
            party={value.party2}
            onChange={(party2) => set({ party2 })}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">
          Agreement Details
        </legend>
        <Field label="Purpose (how Confidential Information may be used)">
          <textarea
            className={inputClass}
            rows={2}
            value={value.purpose}
            onChange={(e) => set({ purpose: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Effective date">
            <input
              className={inputClass}
              type="date"
              value={value.effectiveDate}
              onChange={(e) => set({ effectiveDate: e.target.value })}
            />
          </Field>
          <Field label="Governing law (state)">
            <input
              className={inputClass}
              type="text"
              value={value.governingLawState}
              placeholder="Delaware"
              onChange={(e) => set({ governingLawState: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Jurisdiction (where disputes are heard)">
          <input
            className={inputClass}
            type="text"
            value={value.jurisdiction}
            placeholder="New Castle County, Delaware"
            onChange={(e) => set({ jurisdiction: e.target.value })}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">Term</legend>

        <div className="space-y-2">
          <span className={labelClass}>MNDA Term</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mndaTermType"
                checked={value.mndaTermType === "expires"}
                onChange={() => set({ mndaTermType: "expires" })}
              />
              Expires
              <input
                className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                type="number"
                min={1}
                value={value.mndaTermYears}
                disabled={value.mndaTermType !== "expires"}
                onChange={(e) =>
                  set({ mndaTermYears: Math.max(1, Number(e.target.value) || 1) })
                }
              />
              year(s) from the Effective Date
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mndaTermType"
                checked={value.mndaTermType === "untilTerminated"}
                onChange={() => set({ mndaTermType: "untilTerminated" })}
              />
              Continues until terminated
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <span className={labelClass}>Term of Confidentiality</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="confidentialityTermType"
                checked={value.confidentialityTermType === "years"}
                onChange={() => set({ confidentialityTermType: "years" })}
              />
              <input
                className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                type="number"
                min={1}
                value={value.confidentialityTermYears}
                disabled={value.confidentialityTermType !== "years"}
                onChange={(e) =>
                  set({
                    confidentialityTermYears: Math.max(
                      1,
                      Number(e.target.value) || 1,
                    ),
                  })
                }
              />
              year(s) from the Effective Date
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="confidentialityTermType"
                checked={value.confidentialityTermType === "perpetuity"}
                onChange={() => set({ confidentialityTermType: "perpetuity" })}
              />
              In perpetuity
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">
          Modifications <span className="font-normal text-slate-500">(optional)</span>
        </legend>
        <Field label="List any modifications to the standard MNDA">
          <textarea
            className={inputClass}
            rows={2}
            value={value.modifications}
            placeholder="None"
            onChange={(e) => set({ modifications: e.target.value })}
          />
        </Field>
      </fieldset>
    </form>
  );
}
