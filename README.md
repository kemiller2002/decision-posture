# decisionposture.com (static site)

This is a **static** marketing site for **Decision Posture**.

## Structure
- `index.html` — Home
- `decision-posture.html` — Flagship page
- `talks.html` — Talks & Workshops
- `adoption.html` — Bottom-up adoption path
- `about.html` — Minimal about
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
