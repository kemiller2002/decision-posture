import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// The inquiry service is external. These tests never reach it: the network
// boundary is answered by the test, so the page's claims about success and
// failure are checked against what the service said.
const SERVICE = "https://inquiry.echeloncommunications.com/submit/**";

const answer = (status, body) => route => route.fulfill({
  status,
  contentType: "application/json",
  headers: { "access-control-allow-origin": "*" },
  body: JSON.stringify(body)
});

const fill = async page => {
  await page.getByRole("textbox", { name: "Name" }).fill("Ada Example");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page.getByRole("textbox", { name: "Message" }).fill("Two architects, January window.");
};

test("contact: submission success is confirmed only after the service accepts it", async ({ page }) => {
  const requests = [];
  await page.route(SERVICE, route => {
    requests.push(route.request().postDataJSON());
    return answer(200, { ok: true })(route);
  });
  await page.goto("/contact.html");
  const status = page.getByRole("status");
  await expect(status).toHaveText("");
  await fill(page);
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(status).toHaveText("Thanks — your message has been received.");
  await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("");
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({ formId: "inquiry", name: "Ada Example", email: "ada@example.com" });
});

test("contact: failed submission keeps entries and a retry recovers", async ({ page }) => {
  const outcomes = [answer(500, { ok: false, error: "storage unavailable" }), answer(200, { ok: true })];
  await page.route(SERVICE, route => outcomes.shift()(route));
  await page.goto("/contact.html");
  const status = page.getByRole("status");
  await fill(page);
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(status).toHaveText("Not sent: storage unavailable. Your entries are kept; try again.");
  await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("Ada Example");
  await expect(page.getByRole("button", { name: "Submit application" })).toBeEnabled();
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(status).toHaveText("Thanks — your message has been received.");
});

test("contact: an unreachable service is reported as not sent", async ({ page }) => {
  await page.route(SERVICE, route => route.abort("connectionrefused"));
  await page.goto("/contact.html");
  await fill(page);
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByRole("status")).toHaveText(/^Not sent: .+ Your entries are kept; try again\.$/);
  await expect(page.getByRole("textbox", { name: "Message" })).toHaveValue("Two architects, January window.");
});

// GitHub Pages renders contact-example.html through Jekyll at /contact/.
// Locally the page body is served at that URL (front matter removed, no
// theme layout) so the script reference resolves exactly as it does there.
test("contact: the Jekyll /contact/ page loads its form script and submits", async ({ page }) => {
  const source = await readFile(fileURLToPath(new URL("../../../contact-example.html", import.meta.url)), "utf8");
  const body = source.replace(/^---[\s\S]*?---\s*/, "");
  await page.route("**/contact/", route => route.fulfill({
    contentType: "text/html; charset=utf-8",
    body: `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Contact</title></head><body><main>${body}</main></body></html>`
  }));
  await page.route(SERVICE, answer(200, { ok: true }));
  const script = page.waitForResponse(response => response.url().endsWith("/contact.js"));
  await page.goto("/contact/");
  expect((await script).status()).toBe(200);
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toHaveText("Thanks — your message has been received.");
});
