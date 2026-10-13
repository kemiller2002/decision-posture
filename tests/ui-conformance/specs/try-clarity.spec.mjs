import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { expectActionOutcome } from "../vendor/forma-conformance/index.mjs";
import { ASSESSMENT, fillCompleteAssessment } from "./try-clarity.fixture.mjs";

// Try Clarity runs entirely in the browser; nothing is stored, so every test
// starts from a fresh page (the reset strategy is a reload).
test.beforeEach(async ({ page }) => {
  await page.goto("/try-clarity.html");
});

const report = page => page.locator("#clarity-summary");
const copyStatus = page => page.locator("#copy-status");

test("try-clarity: advanced disclosure opens and closes", async ({ page }) => {
  const signal = page.getByLabel("What signal will you monitor?");
  await expect(signal).toBeHidden();
  await expectActionOutcome(page, {
    ruleId: "ULI-A02",
    action: { role: "disclosure", name: "Advanced trigger design" },
    outcome: { kind: "open", target: "controlled", expected: true }
  });
  await expect(signal).toBeVisible();
  await page.locator("summary", { hasText: "Advanced trigger design" }).press("Enter");
  await expect(signal).toBeHidden();
});

test("try-clarity: choices update guidance and the live recommendation", async ({ page }) => {
  const guidance = page.locator("#confidence-guidance-title");
  await expect(guidance).toHaveText("Choose the confidence level.");
  await expectActionOutcome(page, {
    ruleId: "ULI-A02",
    action: { role: "radio", name: "Low" },
    outcome: { kind: "checked", target: { role: "radio", name: "Low" }, expected: true }
  });
  await expect(guidance).toHaveText(/^Low confidence/);
  // Keyboard parity (ULI-A08): arrow keys move the choice within the group.
  await page.getByRole("radio", { name: "Low" }).press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Moderate" })).toBeChecked();
  await expect(guidance).toHaveText(/^Moderate confidence/);

  const recommendation = page.locator("#recommendation-title");
  await expect(recommendation).toHaveText("Keep the next move proportionate.");
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByRole("radio", { name: "Low" }).check();
  await expect(recommendation).toHaveText("Decide with the uncertainty visible.");
});

test("try-clarity: reassessment posture reveals and requires What changed", async ({ page }) => {
  await page.locator("summary", { hasText: "Advanced trigger design" }).click();
  const changed = page.getByLabel("What changed that forced this claim back into review?");
  await expect(changed).toBeHidden();
  await page.getByRole("radio", { name: "Reassessment" }).check();
  await expect(changed).toBeVisible();
  await expect(changed).toHaveJSProperty("required", true);
  await expect(page.locator("#posture-guidance-title")).toHaveText("Suggested posture: Reassessment");
  await page.getByRole("radio", { name: "Discovery" }).check();
  await expect(changed).toBeHidden();
  await expect(changed).toHaveJSProperty("required", false);
});

test("try-clarity: generate report from a complete assessment", async ({ page }) => {
  await expect(report(page)).toBeHidden();
  await fillCompleteAssessment(page);
  await page.getByRole("button", { name: "Generate Clarity Assessment Report" }).click();
  await expect(report(page)).toBeVisible();
  await expect(page.locator("#summary-claim")).toHaveText(ASSESSMENT.claim);
  await expect(page.locator("#summary-owner")).toHaveText(ASSESSMENT.owner);
  await expect(page.locator("#summary-posture")).toHaveText("Commitment");
  await expect(page.locator("#summary-recommendation")).toHaveText(/^Proceed, but keep it reviewable\./);
  await expect(page.locator("#summary-markdown")).toContainText(`## Claim\n${ASSESSMENT.claim}`);
});

test("try-clarity: incomplete assessment is refused, then recovers", async ({ page }) => {
  const claim = page.getByLabel("What claim are you evaluating?");
  await page.getByRole("button", { name: "Generate Clarity Assessment Report" }).click();
  await expect(report(page)).toBeHidden();
  await expect(claim).toBeFocused();
  await expect(claim).toHaveJSProperty("validity.valueMissing", true);
  await fillCompleteAssessment(page, { submit: true });
  await expect(page.locator("#summary-claim")).toHaveText(ASSESSMENT.claim);
});

test("try-clarity: copy Markdown reports the real clipboard outcome", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await fillCompleteAssessment(page, { submit: true });
  await expect(copyStatus(page)).toHaveText("");
  await page.getByRole("button", { name: "Copy Markdown" }).click();
  await expect(copyStatus(page)).toHaveText("Markdown copied to the clipboard.");
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain(`## Claim\n${ASSESSMENT.claim}`);
});

test("try-clarity: copy failure is reported with a recovery, then a retry succeeds", async ({ page }) => {
  await page.addInitScript(() => {
    window.__clipboardWrites = [];
    window.__refuseClipboard = true;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: text => window.__refuseClipboard
          ? Promise.reject(new DOMException("Write permission denied.", "NotAllowedError"))
          : Promise.resolve(window.__clipboardWrites.push(text))
      }
    });
  });
  await page.reload();
  await fillCompleteAssessment(page, { submit: true });
  await page.getByRole("button", { name: "Copy Markdown" }).click();
  await expect(copyStatus(page)).toHaveText("Copy failed. Select the Markdown export below and copy it manually.");
  await expect(page.locator("#summary-markdown")).toBeVisible();
  await expect(page.locator("#summary-markdown")).toContainText(ASSESSMENT.claim);
  await page.evaluate(() => { window.__refuseClipboard = false; });
  await page.getByRole("button", { name: "Copy Markdown" }).click();
  await expect(copyStatus(page)).toHaveText("Markdown copied to the clipboard.");
  await expect.poll(() => page.evaluate(() => window.__clipboardWrites.length)).toBe(1);
});

test("try-clarity: download HTML saves the report", async ({ page }) => {
  await fillCompleteAssessment(page, { submit: true });
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download HTML" }).click()
  ]);
  expect(download.suggestedFilename()).toBe("clarity-assessment-report.html");
  const saved = await readFile(await download.path(), "utf8");
  expect(saved).toContain("<h1>Clarity Assessment Report</h1>");
  expect(saved).toContain(ASSESSMENT.claim);
});

test("try-clarity: print invokes the browser print with a report-only print layout", async ({ page }) => {
  await page.addInitScript(() => {
    window.__printCalls = 0;
    window.print = () => { window.__printCalls += 1; };
  });
  await page.reload();
  await fillCompleteAssessment(page, { submit: true });
  await page.getByRole("button", { name: "Print / Save PDF" }).click();
  await expect.poll(() => page.evaluate(() => window.__printCalls)).toBe(1);

  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("heading", { name: "Clarity Assessment Report" })).toBeVisible();
  await expect(page.locator("#summary-claim")).toBeVisible();
  await expect(page.getByRole("button", { name: "Generate Clarity Assessment Report" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Print / Save PDF" })).toBeHidden();
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
});
