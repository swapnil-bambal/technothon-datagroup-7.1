import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const generateNdaPdf = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/generatePdf", () => ({
  generateNdaPdf: (...args: unknown[]) => generateNdaPdf(...args),
}));

import DownloadPdfButton from "@/components/DownloadPdfButton";
import { buildNdaDocument } from "@/lib/buildNdaDocument";
import { defaultNdaData } from "@/lib/ndaTypes";

describe("DownloadPdfButton", () => {
  beforeEach(() => generateNdaPdf.mockClear());

  it("calls generateNdaPdf with the document and file name when clicked", async () => {
    const user = userEvent.setup();
    const doc = buildNdaDocument(defaultNdaData);
    render(<DownloadPdfButton ndaDocument={doc} fileBaseName="Mutual-NDA" />);

    await user.click(screen.getByRole("button", { name: /download pdf/i }));

    expect(generateNdaPdf).toHaveBeenCalledTimes(1);
    expect(generateNdaPdf).toHaveBeenCalledWith(doc, "Mutual-NDA");
  });

  it("shows an error message in a live region when generation fails", async () => {
    const user = userEvent.setup();
    generateNdaPdf.mockRejectedValueOnce(new Error("boom"));
    const doc = buildNdaDocument(defaultNdaData);
    render(<DownloadPdfButton ndaDocument={doc} fileBaseName="Mutual-NDA" />);

    await user.click(screen.getByRole("button", { name: /download pdf/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/could not be generated/i);
  });
});
