import { test, expect } from "@playwright/test";
import {
  CONTRACT_WIDTHS,
  expectNoOverflow,
  expectLabelIntact,
  expectPeerAlignment,
  scaleDefaultText
} from "../vendor/forma-conformance/index.mjs";
import {
  ALIGNMENT_GROUPS,
  PAGES,
  TEXT_SCALE_WIDTHS,
  alignmentTestTitle,
  layoutTestTitle,
  textScaleTestTitle
} from "../contract.mjs";
import { fillCompleteAssessment } from "./try-clarity.fixture.mjs";

const HEIGHT = 900;

const open = async (page, path, width) => {
  await page.setViewportSize({ width, height: HEIGHT });
  await page.goto(`/${path}`);
};

// ULI-L06: every navigation destination keeps its whole label on screen.
const expectNavIntact = async page => {
  const links = page.getByRole("navigation").getByRole("link");
  const count = await links.count();
  for (const index of Array.from({ length: count }, (_, i) => i)) {
    await expectLabelIntact(links.nth(index));
  }
};

const resolveScope = (page, target) =>
  target.scope ? { ...target, scope: page.locator(target.scope) } : target;

for (const surface of PAGES) {
  for (const width of CONTRACT_WIDTHS) {
    test(layoutTestTitle(surface.id, width), async ({ page }) => {
      await open(page, surface.path, width);
      await expectNoOverflow(page);
      await expectNavIntact(page);
    });
  }
  for (const width of TEXT_SCALE_WIDTHS) {
    test(textScaleTestTitle(surface.id, width), async ({ page }) => {
      await open(page, surface.path, width);
      await scaleDefaultText(page, 2);
      await expectNoOverflow(page);
      await expectNavIntact(page);
    });
  }
}

for (const surface of PAGES) {
  for (const group of ALIGNMENT_GROUPS[surface.id] ?? []) {
    test(alignmentTestTitle(surface.id, group.id), async ({ page }) => {
      for (const width of group.widths) {
        await open(page, surface.path, width);
        if (group.requiresReport) await fillCompleteAssessment(page, { submit: true });
        for (const edge of group.edges) {
          await expectPeerAlignment(page, {
            ruleId: edge === "top" ? "ULI-L01" : "ULI-L02",
            id: `${group.id}@${width}px/${edge}`,
            edge,
            toleranceCssPx: 1,
            peers: group.targets.map(target => resolveScope(page, target))
          });
        }
      }
    });
  }
}

test("layout: nested 404 keeps the site styles and working recovery links", async ({ page }) => {
  const response = await page.goto("/no/such/nested/page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("That page isn’t here.");
  await expect(page.locator("body")).toHaveCSS("font-family", /ui-sans-serif/);
  await page.getByRole("link", { name: "Go to home" }).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Clarity Framework");
});

test("layout: reduced motion removes transitions and smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "try-clarity.html", 1280);
  await expect(page.getByRole("radio", { name: "Low" }).locator("xpath=..")).toHaveCSS("transition-duration", "0s");
  await fillCompleteAssessment(page, { submit: true });
  await expect(page.getByRole("heading", { name: "Clarity Assessment Report" })).toBeInViewport();
});
