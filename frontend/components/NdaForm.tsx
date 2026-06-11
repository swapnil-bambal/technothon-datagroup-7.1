"use client";

import { useState } from "react";
import type { NdaData, PartyInfo } from "@/lib/ndaTypes";

interface NdaFormProps {
  value: NdaData;
  onChange: (next: NdaData) => void;
}

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";
const labelClass = "block text-sm font-medium text-slate-700";
const numberInputClass =
  "w-16 rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

function PartyFields({
  title,
  idPrefix,
  party,
  onChange,
}: {
  title: string;
  idPrefix: string;
  party: PartyInfo;
  onChange: (next: PartyInfo) => void;
}) {
  const set = (partial: Partial<PartyInfo>) => onChange({ ...party, ...partial });
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <Field id={`${idPrefix}-company`} label="Company">
        <input
          id={`${idPrefix}-company`}
          className={inputClass}
          type="text"
          value={party.company}
          placeholder="Acme, Inc."
          onChange={(e) => set({ company: e.target.value })}
        />
      </Field>
      <Field id={`${idPrefix}-name`} label="Signatory name">
        <input
          id={`${idPrefix}-name`}
          className={inputClass}
          type="text"
          value={party.signatoryName}
          placeholder="Jane Doe"
          onChange={(e) => set({ signatoryName: e.target.value })}
        />
      </Field>
      <Field id={`${idPrefix}-title`} label="Title">
        <input
          id={`${idPrefix}-title`}
          className={inputClass}
          type="text"
          value={party.title}
          placeholder="Chief Executive Officer"
          onChange={(e) => set({ title: e.target.value })}
        />
      </Field>
      <Field id={`${idPrefix}-notice`} label="Notice address (email or postal)">
        <input
          id={`${idPrefix}-notice`}
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

/**
 * A "choose N years, or a fixed alternative" control, used by both the MNDA
 * Term and the Term of Confidentiality. The year input keeps its own raw
 * string state so the field can be cleared and retyped freely; it commits a
 * clamped value on valid input and normalizes on blur.
 */
function TermYearsField({
  legend,
  name,
  yearsId,
  isYears,
  years,
  yearsLeadingText,
  alternativeLabel,
  onSelectYears,
  onSelectAlternative,
  onYearsChange,
}: {
  legend: string;
  name: string;
  yearsId: string;
  isYears: boolean;
  years: number;
  yearsLeadingText: string;
  alternativeLabel: string;
  onSelectYears: () => void;
  onSelectAlternative: () => void;
  onYearsChange: (years: number) => void;
}) {
  const [raw, setRaw] = useState(String(years));
  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={name}
            checked={isYears}
            onChange={onSelectYears}
          />
          {yearsLeadingText}
        </label>
        <span className="inline-flex items-center gap-2">
          <label htmlFor={yearsId} className="sr-only">
            {legend}: number of years
          </label>
          <input
            id={yearsId}
            className={numberInputClass}
            type="number"
            min={1}
            value={raw}
            disabled={!isYears}
            onChange={(e) => {
              setRaw(e.target.value);
              const n = Number(e.target.value);
              if (e.target.value !== "" && Number.isInteger(n) && n >= 1) {
                onYearsChange(n);
              }
            }}
            onBlur={() => {
              const n = Math.max(1, Math.floor(Number(raw) || 1));
              setRaw(String(n));
              onYearsChange(n);
            }}
          />
          year(s) from the Effective Date
        </span>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={name}
            checked={!isYears}
            onChange={onSelectAlternative}
          />
          {alternativeLabel}
        </label>
      </div>
    </fieldset>
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
            idPrefix="party1"
            party={value.party1}
            onChange={(party1) => set({ party1 })}
          />
          <PartyFields
            title="Party 2"
            idPrefix="party2"
            party={value.party2}
            onChange={(party2) => set({ party2 })}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">
          Agreement Details
        </legend>
        <Field
          id="purpose"
          label="Purpose (how Confidential Information may be used)"
        >
          <textarea
            id="purpose"
            className={inputClass}
            rows={2}
            value={value.purpose}
            onChange={(e) => set({ purpose: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="effective-date" label="Effective date">
            <input
              id="effective-date"
              className={inputClass}
              type="date"
              value={value.effectiveDate}
              onChange={(e) => set({ effectiveDate: e.target.value })}
            />
          </Field>
          <Field id="governing-law" label="Governing law (state)">
            <input
              id="governing-law"
              className={inputClass}
              type="text"
              value={value.governingLawState}
              placeholder="Delaware"
              onChange={(e) => set({ governingLawState: e.target.value })}
            />
          </Field>
        </div>
        <Field id="jurisdiction" label="Jurisdiction (where disputes are heard)">
          <input
            id="jurisdiction"
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
        <TermYearsField
          legend="MNDA Term"
          name="mndaTermType"
          yearsId="mnda-term-years"
          isYears={value.mndaTermType === "expires"}
          years={value.mndaTermYears}
          yearsLeadingText="Expires"
          alternativeLabel="Continues until terminated"
          onSelectYears={() => set({ mndaTermType: "expires" })}
          onSelectAlternative={() => set({ mndaTermType: "untilTerminated" })}
          onYearsChange={(mndaTermYears) => set({ mndaTermYears })}
        />
        <TermYearsField
          legend="Term of Confidentiality"
          name="confidentialityTermType"
          yearsId="confidentiality-term-years"
          isYears={value.confidentialityTermType === "years"}
          years={value.confidentialityTermYears}
          yearsLeadingText="For"
          alternativeLabel="In perpetuity"
          onSelectYears={() => set({ confidentialityTermType: "years" })}
          onSelectAlternative={() =>
            set({ confidentialityTermType: "perpetuity" })
          }
          onYearsChange={(confidentialityTermYears) =>
            set({ confidentialityTermYears })
          }
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">
          Modifications{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </legend>
        <Field
          id="modifications"
          label="List any modifications to the standard MNDA"
        >
          <textarea
            id="modifications"
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
