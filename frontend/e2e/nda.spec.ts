import { test, expect } from "@playwright/test";

test("fills the form, updates the preview live, and downloads a PDF", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Mutual NDA Creator" }),
  ).toBeVisible();

  // Fill a couple of key fields.
  await page.getByLabel("Company").first().fill("Acme, Inc.");
  await page.getByLabel(/Governing law/i).fill("Delaware");

  // The preview updates live.
  await expect(page.getByText("Party 1: Acme, Inc.")).toBeVisible();
  await expect(page.getByText(/laws of the State of Delaware/)).toBeVisible();

  // Switching the confidentiality term updates the cover page.
  await page.getByLabel(/In perpetuity/i).check();
  await expect(page.getByText("In perpetuity.").first()).toBeVisible();

  // Download the PDF and assert a .pdf file is produced.
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /download pdf/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});
