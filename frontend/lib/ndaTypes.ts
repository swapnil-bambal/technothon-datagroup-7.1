// Shape of the data collected from the form. These map to the fillable fields
// on the Common Paper Mutual NDA Cover Page.

export type MndaTermType = "expires" | "untilTerminated";
export type ConfidentialityTermType = "years" | "perpetuity";

export interface PartyInfo {
  company: string;
  signatoryName: string;
  title: string;
  noticeAddress: string;
}

export interface NdaData {
  party1: PartyInfo;
  party2: PartyInfo;
  /** How Confidential Information may be used. */
  purpose: string;
  /** ISO date string (yyyy-mm-dd). */
  effectiveDate: string;
  mndaTermType: MndaTermType;
  mndaTermYears: number;
  confidentialityTermType: ConfidentialityTermType;
  confidentialityTermYears: number;
  /** Governing law (a US state). */
  governingLawState: string;
  /** Jurisdiction, e.g. "courts located in New Castle, DE". */
  jurisdiction: string;
  /** Optional free-text list of modifications to the standard MNDA. */
  modifications: string;
}

function emptyParty(): PartyInfo {
  return { company: "", signatoryName: "", title: "", noticeAddress: "" };
}

export const defaultNdaData: NdaData = {
  party1: emptyParty(),
  party2: emptyParty(),
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: "",
  mndaTermType: "expires",
  mndaTermYears: 1,
  confidentialityTermType: "years",
  confidentialityTermYears: 1,
  governingLawState: "",
  jurisdiction: "",
  modifications: "",
};
