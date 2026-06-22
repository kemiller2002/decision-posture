# decisionposture.com (static site)

This is a **static** site for the **Clarity Framework**.

## Structure
- `index.html` — Home
- `framework.html` — Core framework concepts
- `assessments.html` — Clarity Assessment / Clarity Audit
- `glossary.html` — Working definitions
- `research.html` — Open questions
- `about.html` — Framework purpose and scope
- `decision-posture.html`, `decision-map.html`, `decision-records.html`, `guides.html`, `talks.html`, `adoption.html`, `clarity.html` — Legacy redirects
- `contact.html` — Contact / inquiry
- `css/site.css` — Site styles (accessible, high-contrast)
- `js/main.js` — Theme + font-size toggles, mobile menu
- `assets/logo.svg` — Inline-safe SVG logo

## Accessibility
- Skip link
- Strong focus outlines
- High-contrast default theme + optional light mode
- Optional "Large text" toggle (persists)
- Reduced-motion support

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
