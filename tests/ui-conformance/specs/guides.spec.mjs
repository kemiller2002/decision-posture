import { test, expect } from "@playwright/test";

const GUIDES = Object.freeze([
  ["decision-map", "Decision Map"],
  ["decision-constitution", "Decision Constitution"],
  ["decision-posture-model", "Decision Posture Model"]
]);

for (const [slug] of GUIDES) {
  test(`guides: ${slug} renders its Markdown source`, async ({ page }) => {
    await page.goto(`/guides/${slug}.html`);
    const article = page.locator("article.guide-prose");
    await expect(article.getByRole("heading").first()).toBeVisible();
    await expect(article).not.toHaveAttribute("aria-busy", "true");
    await expect(article.getByRole("alert")).toHaveCount(0);
  });
}

// ULI-A07/L08: loading and failure are stated, and failure offers a route
// to the same content.
test("guides: a failed load says so and links to the guide source", async ({ page }) => {
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await page.route("**/guides/decision-map.md", async route => {
    await held;
    await route.fulfill({ status: 503, body: "unavailable" });
  });
  await page.goto("/guides/decision-map.html");
  const article = page.locator("article.guide-prose");
  await expect(article.getByRole("status")).toHaveText("Loading the guide…");
  await expect(article).toHaveAttribute("aria-busy", "true");
  release();
  await expect(article.getByRole("alert")).toContainText("The guide could not be loaded.");
  await expect(article).not.toHaveAttribute("aria-busy", "true");
  await page.unroute("**/guides/decision-map.md");
  const source = article.getByRole("link", { name: "Open the guide source (Markdown)" });
  const href = new URL(await source.getAttribute("href"), page.url()).href;
  expect(href).toMatch(/\/guides\/decision-map\.md$/);
  const response = await page.request.get(href);
  expect(response.status()).toBe(200);
  expect(await response.text()).toMatch(/^# /m);
  // Recovery: a reload with the source reachable renders the guide.
  await page.reload();
  await expect(article.getByRole("heading").first()).toBeVisible();
});
