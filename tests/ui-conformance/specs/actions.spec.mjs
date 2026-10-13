import { test, expect } from "@playwright/test";
import { inventoryActions } from "../vendor/forma-conformance/index.mjs";
import {
  CONTROLS,
  PAGES,
  PRIMARY_NAV,
  REDIRECTS,
  inventoryTestTitle,
  linksTestTitle
} from "../contract.mjs";

const isLink = action => action.role === "link";
const sameControl = (a, b) => a.role === b.role && a.name === b.name;

// Resolve an href against the page and check the destination is real: an
// HTTP 200 for the document and, for a fragment, an element with that id.
const checkDestination = async (page, href) => {
  const url = new URL(href, page.url());
  if (url.protocol === "mailto:") return { href, ok: /^[^@\s]+@[^@\s]+$/.test(url.pathname) };
  const response = await page.request.get(url.href.replace(/#.*$/, ""));
  if (response.status() !== 200) return { href, ok: false, status: response.status() };
  if (!url.hash) return { href, ok: true };
  const id = decodeURIComponent(url.hash.slice(1));
  const sameDocument = url.pathname === new URL(page.url()).pathname;
  const found = sameDocument
    ? (await page.locator(`[id="${id}"]`).count()) === 1
    : (await response.text()).includes(`id="${id}"`);
  return { href, ok: found };
};

for (const surface of PAGES) {
  // ULI-A01/A02: every enabled link leads to a meaningful destination.
  test(linksTestTitle(surface.id), async ({ page }) => {
    await page.goto(`/${surface.path}`);
    const links = (await inventoryActions(page, { includeHidden: true })).filter(isLink);
    const results = await Promise.all(links.map(link => checkDestination(page, link.href)));
    expect(results.filter(result => !result.ok)).toEqual([]);
    expect(links.every(link => link.name.length > 0)).toBe(true);
  });

  // ULI-A10: every non-link control on the page is declared with an outcome
  // test; a new control fails here until it is declared and exercised.
  test(inventoryTestTitle(surface.id), async ({ page }) => {
    await page.goto(`/${surface.path}`);
    const controls = (await inventoryActions(page, { includeHidden: true })).filter(action => !isLink(action));
    const declared = (CONTROLS[surface.id] ?? []).map(entry => entry.control);
    const undeclared = controls.filter(control => !declared.some(entry => sameControl(entry, control)));
    expect(undeclared.map(({ role, name }) => ({ role, name }))).toEqual([]);
  });
}

test("actions: primary navigation is identical on every Clarity page", async ({ page }) => {
  const expected = PRIMARY_NAV.map(([name, href]) => ({ name, href }));
  for (const surface of PAGES.filter(entry => entry.nav === "primary")) {
    await page.goto(`/${surface.path}`);
    const nav = page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link");
    const observed = await nav.evaluateAll(links => links.map(link => ({ name: link.textContent.trim(), href: link.getAttribute("href") })));
    expect(observed, surface.path).toEqual(expected);
    await expect(nav.and(page.locator("[aria-current=page]")), surface.path)
      .toHaveCount(PRIMARY_NAV.some(([, href]) => href === surface.path) ? 1 : 0);
  }
});

test("actions: every primary navigation link navigates to its page", async ({ page }) => {
  for (const [name, href] of PRIMARY_NAV) {
    await page.goto("/about.html");
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${href.replace(".", "\\.")}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("actions: home calls to action open Try Clarity and download the template", async ({ page }) => {
  await page.goto("/index.html");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Download Template" }).click()
  ]);
  expect(download.suggestedFilename()).toBe("clarity-quick-assessment-v1.md");
  await page.getByRole("main").getByRole("link", { name: "Try Clarity", exact: true }).click();
  await expect(page).toHaveURL(/\/try-clarity\.html$/);
});

test("actions: starter kit downloads both template formats", async ({ page }) => {
  await page.goto("/starter-kit.html");
  for (const [name, file] of [["Download Markdown →", "clarity-quick-assessment-v1.md"], ["Download HTML →", "clarity-quick-assessment-v1.html"]]) {
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name }).click()]);
    expect(download.suggestedFilename()).toBe(file);
  }
});

test("actions: skip link moves focus to the assessment", async ({ page }) => {
  await page.goto("/try-clarity.html");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to assessment" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

for (const [from, to] of REDIRECTS) {
  test(`actions: legacy ${from} redirects to ${to}`, async ({ page }) => {
    await page.goto(`/${from}`);
    await expect(page).toHaveURL(new RegExp(`/${to.replace(/[.#]/g, "\\$&")}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}
