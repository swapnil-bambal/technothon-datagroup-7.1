import { describe, it, expect } from "vitest";
import {
  buildNdaDocument,
  mndaTermText,
  confidentialityTermText,
  formatEffectiveDate,
  ndaFileBaseName,
} from "@/lib/buildNdaDocument";
import { defaultNdaData, type NdaData } from "@/lib/ndaTypes";

function makeData(overrides: Partial<NdaData> = {}): NdaData {
  return { ...defaultNdaData, ...overrides };
}

describe("mndaTermText", () => {
  it("formats an expiring term, singular and plural", () => {
    expect(
      mndaTermText(makeData({ mndaTermType: "expires", mndaTermYears: 1 })),
    ).toBe("Expires 1 year from the Effective Date.");
    expect(
      mndaTermText(makeData({ mndaTermType: "expires", mndaTermYears: 3 })),
    ).toBe("Expires 3 years from the Effective Date.");
  });

  it("formats an until-terminated term", () => {
    expect(mndaTermText(makeData({ mndaTermType: "untilTerminated" }))).toBe(
      "Continues until terminated in accordance with the terms of the MNDA.",
    );
  });
});

describe("confidentialityTermText", () => {
  it("formats a fixed number of years", () => {
    expect(
      confidentialityTermText(
        makeData({ confidentialityTermType: "years", confidentialityTermYears: 2 }),
      ),
    ).toMatch(/^2 years from the Effective Date/);
  });

  it("formats perpetuity", () => {
    expect(
      confidentialityTermText(makeData({ confidentialityTermType: "perpetuity" })),
    ).toBe("In perpetuity.");
  });
});

describe("formatEffectiveDate", () => {
  it("returns a placeholder when blank", () => {
    expect(formatEffectiveDate("")).toBe("[Effective Date]");
  });

  it("formats an ISO date in en-US", () => {
    expect(formatEffectiveDate("2026-03-01")).toBe("March 1, 2026");
  });
});

describe("ndaFileBaseName", () => {
  it("includes both company names when present", () => {
    const data = makeData({
      party1: { ...defaultNdaData.party1, company: "Acme, Inc." },
      party2: { ...defaultNdaData.party2, company: "Globex LLC" },
    });
    expect(ndaFileBaseName(data)).toBe("Mutual-NDA-Acme-Inc-and-Globex-LLC");
  });

  it("falls back to a generic name when companies are blank", () => {
    expect(ndaFileBaseName(defaultNdaData)).toBe("Mutual-NDA");
  });
});

describe("buildNdaDocument", () => {
  it("produces 11 Standard Terms sections and 2 parties", () => {
    const doc = buildNdaDocument(defaultNdaData);
    expect(doc.sections).toHaveLength(11);
    expect(doc.parties).toHaveLength(2);
    expect(doc.title).toBe("Mutual Non-Disclosure Agreement");
  });

  it("weaves entered values into the cover page and Standard Terms", () => {
    const doc = buildNdaDocument(
      makeData({
        governingLawState: "Delaware",
        jurisdiction: "New Castle County, Delaware",
        effectiveDate: "2026-03-01",
      }),
    );

    expect(
      doc.coverFields.find((f) => f.label === "Governing Law")?.value,
    ).toBe("Delaware");

    const section9 = doc.sections.find((s) => s.number === 9);
    expect(section9?.paragraphs[0]).toContain("laws of the State of Delaware");
    expect(section9?.paragraphs[0]).toContain("New Castle County, Delaware");

    const section5 = doc.sections.find((s) => s.number === 5);
    expect(section5?.paragraphs[0]).toContain("March 1, 2026");
  });

  it("uses bracketed placeholders for empty fields", () => {
    const doc = buildNdaDocument(defaultNdaData);
    expect(doc.coverFields.find((f) => f.label === "Governing Law")?.value).toBe(
      "[State]",
    );
    expect(doc.parties[0].company).toBe("[Company name]");
  });

  it("reflects the MNDA term and confidentiality choices in the cover page", () => {
    const doc = buildNdaDocument(
      makeData({
        mndaTermType: "untilTerminated",
        confidentialityTermType: "perpetuity",
      }),
    );
    expect(doc.coverFields.find((f) => f.label === "MNDA Term")?.value).toContain(
      "Continues until terminated",
    );
    expect(
      doc.coverFields.find((f) => f.label === "Term of Confidentiality")?.value,
    ).toBe("In perpetuity.");
  });
});
