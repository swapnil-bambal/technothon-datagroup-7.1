import type { NdaData } from "./ndaTypes";

// A renderer-agnostic representation of the completed Mutual NDA. Both the
// on-screen preview (React) and the PDF generator (jsPDF) consume this single
// structure so the two never drift apart.

export interface CoverField {
  label: string;
  value: string;
}

export interface PartyBlock {
  label: string;
  company: string;
  signatoryName: string;
  title: string;
  noticeAddress: string;
}

export interface TermsSection {
  number: number;
  title: string;
  /** One or more paragraphs of body text. */
  paragraphs: string[];
}

export interface NdaDocument {
  title: string;
  intro: string;
  coverFields: CoverField[];
  parties: PartyBlock[];
  executionNote: string;
  termsTitle: string;
  sections: TermsSection[];
  attribution: string;
}

const PLACEHOLDER = {
  purpose: "[Describe the purpose]",
  effectiveDate: "[Effective Date]",
  governingLaw: "[State]",
  jurisdiction: "[City or county and state]",
  company: "[Company name]",
  name: "[Name]",
  title: "[Title]",
  notice: "[Email or postal address]",
};

function orPlaceholder(value: string, placeholder: string): string {
  const v = value.trim();
  return v.length > 0 ? v : placeholder;
}

function pluralYears(years: number): string {
  const n = Number.isFinite(years) && years > 0 ? years : 1;
  return `${n} year${n === 1 ? "" : "s"}`;
}

export function formatEffectiveDate(iso: string): string {
  if (!iso) return PLACEHOLDER.effectiveDate;
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function mndaTermText(data: NdaData): string {
  if (data.mndaTermType === "untilTerminated") {
    return "Continues until terminated in accordance with the terms of the MNDA.";
  }
  return `Expires ${pluralYears(data.mndaTermYears)} from the Effective Date.`;
}

export function confidentialityTermText(data: NdaData): string {
  if (data.confidentialityTermType === "perpetuity") {
    return "In perpetuity.";
  }
  return `${pluralYears(
    data.confidentialityTermYears,
  )} from the Effective Date, but in the case of trade secrets, until the Confidential Information is no longer considered a trade secret under applicable laws.`;
}

/**
 * Build the completed Mutual NDA from the form data. The cover page reflects
 * every entered value; the Standard Terms reproduce the Common Paper Mutual NDA
 * (v1.0) boilerplate with the Effective Date, Governing Law, and Jurisdiction
 * woven in where they read naturally.
 */
export function buildNdaDocument(data: NdaData): NdaDocument {
  const effective = formatEffectiveDate(data.effectiveDate);
  const governingLaw = orPlaceholder(
    data.governingLawState,
    PLACEHOLDER.governingLaw,
  );
  const jurisdiction = orPlaceholder(
    data.jurisdiction,
    PLACEHOLDER.jurisdiction,
  );

  const coverFields: CoverField[] = [
    { label: "Purpose", value: orPlaceholder(data.purpose, PLACEHOLDER.purpose) },
    { label: "Effective Date", value: effective },
    { label: "MNDA Term", value: mndaTermText(data) },
    { label: "Term of Confidentiality", value: confidentialityTermText(data) },
    { label: "Governing Law", value: governingLaw },
    { label: "Jurisdiction", value: jurisdiction },
    {
      label: "MNDA Modifications",
      value: orPlaceholder(data.modifications, "None."),
    },
  ];

  const parties: PartyBlock[] = [
    {
      label: "Party 1",
      company: orPlaceholder(data.party1.company, PLACEHOLDER.company),
      signatoryName: orPlaceholder(data.party1.signatoryName, PLACEHOLDER.name),
      title: orPlaceholder(data.party1.title, PLACEHOLDER.title),
      noticeAddress: orPlaceholder(data.party1.noticeAddress, PLACEHOLDER.notice),
    },
    {
      label: "Party 2",
      company: orPlaceholder(data.party2.company, PLACEHOLDER.company),
      signatoryName: orPlaceholder(data.party2.signatoryName, PLACEHOLDER.name),
      title: orPlaceholder(data.party2.title, PLACEHOLDER.title),
      noticeAddress: orPlaceholder(data.party2.noticeAddress, PLACEHOLDER.notice),
    },
  ];

  const sections: TermsSection[] = [
    {
      number: 1,
      title: "Introduction",
      paragraphs: [
        'This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page) (the "MNDA") allows each party (the "Disclosing Party") to disclose or make available information in connection with the Purpose which (1) the Disclosing Party identifies to the receiving party (the "Receiving Party") as "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure ("Confidential Information"). Each party’s Confidential Information also includes the existence and status of the parties’ discussions and the information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how.',
      ],
    },
    {
      number: 2,
      title: "Use and Protection of Confidential Information",
      paragraphs: [
        "The Receiving Party shall: (a) use Confidential Information solely for the Purpose; (b) not disclose Confidential Information to third parties without the Disclosing Party’s prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the Purpose, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.",
      ],
    },
    {
      number: 3,
      title: "Exceptions",
      paragraphs: [
        "The Receiving Party’s obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.",
      ],
    },
    {
      number: 4,
      title: "Disclosures Required by Law",
      paragraphs: [
        "The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party’s expense, with the Disclosing Party’s efforts to obtain confidential treatment for the Confidential Information.",
      ],
    },
    {
      number: 5,
      title: "Term and Termination",
      paragraphs: [
        `This MNDA commences on ${effective} (the Effective Date) and expires at the end of the MNDA Term. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party’s obligations relating to Confidential Information will survive for the Term of Confidentiality, despite any expiration or termination of this MNDA.`,
      ],
    },
    {
      number: 6,
      title: "Return or Destruction of Confidential Information",
      paragraphs: [
        "Upon expiration or termination of this MNDA or upon the Disclosing Party’s earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party’s written request, destroy all Confidential Information in the Receiving Party’s possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.",
      ],
    },
    {
      number: 7,
      title: "Proprietary Rights",
      paragraphs: [
        "The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.",
      ],
    },
    {
      number: 8,
      title: "Disclaimer",
      paragraphs: [
        'ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.',
      ],
    },
    {
      number: 9,
      title: "Governing Law and Jurisdiction",
      paragraphs: [
        `This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of ${governingLaw}, without regard to the conflict of laws provisions of such state. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in ${jurisdiction}. Each party irrevocably submits to the exclusive jurisdiction of such courts in any such suit, action, or proceeding.`,
      ],
    },
    {
      number: 10,
      title: "Equitable Relief",
      paragraphs: [
        "A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.",
      ],
    },
    {
      number: 11,
      title: "General",
      paragraphs: [
        "Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party’s permitted successors and assigns.",
        "Waivers must be signed by the waiving party’s authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.",
      ],
    },
  ];

  return {
    title: "Mutual Non-Disclosure Agreement",
    intro:
      'This Mutual Non-Disclosure Agreement (the "MNDA") consists of this Cover Page and the Common Paper Mutual NDA Standard Terms (Version 1.0). By signing the Cover Page, each party agrees to enter into this MNDA as of the Effective Date.',
    coverFields,
    parties,
    executionNote:
      "By signing below, each party agrees to enter into this MNDA as of the Effective Date.",
    termsTitle: "Standard Terms",
    sections,
    attribution:
      "Based on the Common Paper Mutual Non-Disclosure Agreement (Version 1.0), used under CC BY 4.0 — https://commonpaper.com/standards/mutual-nda/1.0/",
  };
}

/** A filesystem-friendly name for the downloaded document. */
export function ndaFileBaseName(data: NdaData): string {
  const parts = [data.party1.company, data.party2.company]
    .map((c) => c.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, ""))
    .filter(Boolean);
  const suffix = parts.length === 2 ? `-${parts[0]}-and-${parts[1]}` : "";
  return `Mutual-NDA${suffix}`;
}
