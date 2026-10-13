# decisionposture.com (static site)

This is a **static** site for the **Clarity Framework**.

## Structure
- `index.html` — Home
- `framework.html` — Core framework concepts
- `learn.html` — Exercises and worked examples
- `how-it-fits.html` — How Clarity complements existing frameworks
- `assessment-process.html` — Step-by-step Clarity Assessment guide
- `starter-kit.html` — Downloadable Clarity Quick Assessment
- `try-clarity.html` — Local guided assessment experience
- `assessments.html` — Clarity Assessment / Clarity Audit
- `glossary.html` — Working definitions
- `research.html` — Open questions
- `about.html` — Framework purpose and scope
- `decision-posture.html`, `decision-map.html`, `decision-records.html`, `guides.html`, `talks.html`, `adoption.html`, `clarity.html` — Legacy redirects
- `contact.html` — Contact / inquiry
- `css/site.css` — Site styles (accessible, high-contrast)
- `js/try-clarity.js` — Try Clarity assessment, report, copy/download/print
- `js/contact.js` — Contact/application form submission
- `js/guide.js` — Renders the Markdown guides in `guides/`
- `js/main.js` — Theme/font-size/menu toggles; not loaded by any current page
- `assets/logo.svg` — Inline-safe SVG logo

## Accessibility
- Skip link (Try Clarity)
- Strong focus outlines
- High-contrast dark theme
- Layout reflows at 320px and with 200% browser text size
- Reduced-motion support

## UI conformance tests
The site follows `visual-engineering/UI-LAYOUT-INTERACTION@1.0.0`. The
Playwright suite and its tooling live in `tests/ui-conformance` (test-only;
the site has no build step) and run in CI (`.github/workflows/ui-conformance.yml`):

```bash
cd tests/ui-conformance
npm ci
npm run ui:conformance   # browser tests (Chromium)
npm run ui:evidence      # schema-valid evidence in reports/
```

Declared pages, actions and alignment groups are in
`tests/ui-conformance/contract.mjs`; a new control fails the suite until it
is declared there with an outcome test.

## Deploy
### GitHub Pages
1. Put these files at the repo root (or configure Pages to publish the `docs/` folder).
2. Ensure the `CNAME` file contains your custom domain.
3. In GitHub: **Settings → Pages** and set the custom domain.
4. In DNS: point `decisionposture.com` / `www` as needed.

### Local preview
Open `index.html` directly, or run:
```bash
python -m http.server 8080
```

---
Created by HelixNote, an Echelon Foundry initiative.
