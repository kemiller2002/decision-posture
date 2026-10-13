import { expect } from "@playwright/test";

// A complete quick assessment, entered through labels and roles only.
export const ASSESSMENT = Object.freeze({
  claim: "Customers want offline mode in the field app.",
  evidence: "Twelve of twenty support tickets last quarter mention lost connectivity.",
  assumptions: "Ticket volume reflects the wider customer base.",
  owner: "Field product lead",
  mindChange: "A usage study shows fewer than 10% of sessions lose connectivity."
});

export const fillCompleteAssessment = async (page, { submit = false } = {}) => {
  await page.getByLabel("What claim are you evaluating?").fill(ASSESSMENT.claim);
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByLabel("What evidence currently supports the claim?").fill(ASSESSMENT.evidence);
  await page.getByLabel("What assumptions must remain true for the claim to hold?").fill(ASSESSMENT.assumptions);
  await page.getByRole("radio", { name: "Moderate" }).check();
  await page.getByRole("radio", { name: "Some recovery cost" }).check();
  await page.getByLabel("Who is responsible if this claim is wrong?").fill(ASSESSMENT.owner);
  await page.getByLabel("What would change your mind?").fill(ASSESSMENT.mindChange);
  if (submit) {
    await page.getByRole("button", { name: "Generate Clarity Assessment Report" }).click();
    await expect(page.getByRole("heading", { name: "Clarity Assessment Report" })).toBeVisible();
  }
};
