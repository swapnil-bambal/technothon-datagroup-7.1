import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// The button imports jsPDF via generateNdaPdf; mock it so these interaction
// tests never touch the browser download path.
vi.mock("@/lib/generatePdf", () => ({
  generateNdaPdf: vi.fn().mockResolvedValue(undefined),
}));

import NdaCreator from "@/components/NdaCreator";

describe("NdaCreator (form drives the live preview)", () => {
  it("reflects a typed company name in the preview", async () => {
    const user = userEvent.setup();
    render(<NdaCreator />);

    const companyInputs = screen.getAllByLabelText("Company");
    await user.type(companyInputs[0], "Acme, Inc.");

    expect(screen.getByText(/Party 1: Acme, Inc\./)).toBeInTheDocument();
  });

  it("weaves the governing law into the rendered Standard Terms", async () => {
    const user = userEvent.setup();
    render(<NdaCreator />);

    await user.type(screen.getByLabelText(/Governing law/i), "Delaware");

    expect(
      screen.getByText(/laws of the State of Delaware/),
    ).toBeInTheDocument();
  });

  it("switches the confidentiality term to perpetuity", async () => {
    const user = userEvent.setup();
    render(<NdaCreator />);

    await user.click(screen.getByLabelText(/In perpetuity/i));

    expect(screen.getAllByText(/In perpetuity\./).length).toBeGreaterThan(0);
  });
});
