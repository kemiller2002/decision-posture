// Declared UI conformance contract for decisionposture.com against
// visual-engineering/UI-LAYOUT-INTERACTION@1.0.0 (rule IDs are cited, not restated).
//
// This module is data. The specs build their tests from it and
// emit-evidence.mjs turns test results into schema-valid evidence. Each
// action and alignment group names the exact test title that evidences it;
// a missing or failed test yields `unknown` or `fail`, never `pass`.

export const REPOSITORY = "kemiller2002/decision-posture";
export const CLASSIFICATION = "site-ui";

// Primary navigation shared by every current Clarity page (checked for
// identity across pages, then exercised once per destination).
export const PRIMARY_NAV = Object.freeze([
  ["Home", "index.html"],
  ["Framework", "framework.html"],
  ["Glossary", "glossary.html"],
  ["Learn", "learn.html"],
  ["How It Fits", "how-it-fits.html"],
  ["Assessments", "assessment-process.html"],
  ["Starter Kit", "starter-kit.html"],
  ["Try Clarity", "try-clarity.html"],
  ["Research", "research.html"],
  ["About", "about.html"]
]);

// Every published HTML page. `nav` names the navigation the page carries.
export const PAGES = Object.freeze([
  { id: "home", path: "index.html", kind: "marketing", nav: "primary" },
  { id: "framework", path: "framework.html", kind: "marketing", nav: "primary" },
  { id: "glossary", path: "glossary.html", kind: "marketing", nav: "primary" },
  { id: "learn", path: "learn.html", kind: "marketing", nav: "primary" },
  { id: "how-it-fits", path: "how-it-fits.html", kind: "marketing", nav: "primary" },
  { id: "assessment-process", path: "assessment-process.html", kind: "marketing", nav: "primary" },
  { id: "starter-kit", path: "starter-kit.html", kind: "marketing", nav: "primary" },
  { id: "try-clarity", path: "try-clarity.html", kind: "product", nav: "primary" },
  { id: "research", path: "research.html", kind: "marketing", nav: "primary" },
  { id: "about", path: "about.html", kind: "marketing", nav: "primary" },
  { id: "assessments", path: "assessments.html", kind: "marketing", nav: "primary" },
  { id: "contact", path: "contact.html", kind: "marketing", nav: "legacy" },
  { id: "quick-assessment-template", path: "clarity-quick-assessment-v1.html", kind: "print", nav: "none" },
  { id: "guide-decision-map", path: "guides/decision-map.html", kind: "other", nav: "guide" },
  { id: "guide-decision-constitution", path: "guides/decision-constitution.html", kind: "other", nav: "guide" },
  { id: "guide-decision-posture-model", path: "guides/decision-posture-model.html", kind: "other", nav: "guide" },
  { id: "not-found", path: "404.html", kind: "other", nav: "none" }
]);

// Legacy URLs kept as meta-refresh redirects.
export const REDIRECTS = Object.freeze([
  ["adoption.html", "assessments.html"],
  ["clarity.html", "framework.html"],
  ["decision-map.html", "assessments.html"],
  ["decision-posture.html", "framework.html#postures"],
  ["decision-records.html", "assessments.html"],
  ["guides.html", "research.html"],
  ["talks.html", "research.html"]
]);

// Controls other than links. Links are verified by destination (every
// inventoried link) and by click-through (primary nav); anything else that
// appears in an inventory without a declaration fails the inventory test.
export const CONTROLS = Object.freeze({
  "try-clarity": [
    { id: "advanced-disclosure", control: { role: "disclosure", name: "Advanced trigger design" },
      intent: "Reveal optional trigger-design fields",
      expectedOutcome: "details element opens and the monitoring-signal field is visible",
      resetStrategy: "click again to close", test: "try-clarity: advanced disclosure opens and closes" },
    { id: "confidence-choice", control: { role: "radio", name: "Low" },
      intent: "Record confidence relative to the evidence",
      expectedOutcome: "radio checked and the confidence guidance names the chosen level",
      resetStrategy: "reload the page", test: "try-clarity: choices update guidance and the live recommendation" },
    { id: "reassessment-posture", control: { role: "radio", name: "Reassessment" },
      intent: "Override the suggested posture",
      expectedOutcome: "the What changed field appears and becomes required",
      resetStrategy: "reload the page", test: "try-clarity: reassessment posture reveals and requires What changed" },
    { id: "generate-report", control: { role: "button", name: "Generate Clarity Assessment Report" },
      intent: "Generate the local assessment report",
      expectedOutcome: "report region shows the entered claim, owner and recommendation plus a Markdown export",
      resetStrategy: "reload the page (nothing is stored)", test: "try-clarity: generate report from a complete assessment" },
    { id: "generate-report-invalid", control: { role: "button", name: "Generate Clarity Assessment Report" },
      intent: "Refuse an incomplete assessment",
      expectedOutcome: "report stays hidden and the first missing required field is invalid and focused",
      resetStrategy: "fill the field and submit again", test: "try-clarity: incomplete assessment is refused, then recovers" },
    { id: "copy-markdown", control: { role: "button", name: "Copy Markdown" },
      intent: "Copy the Markdown export",
      expectedOutcome: "clipboard holds the Markdown and the status says it was copied",
      resetStrategy: "status is replaced on the next copy", test: "try-clarity: copy Markdown reports the real clipboard outcome" },
    { id: "copy-markdown-failure", control: { role: "button", name: "Copy Markdown" },
      intent: "Report a refused clipboard honestly",
      expectedOutcome: "status says the copy failed and names the visible Markdown export as recovery",
      resetStrategy: "retry copy", test: "try-clarity: copy failure is reported with a recovery, then a retry succeeds" },
    { id: "download-report", control: { role: "button", name: "Download HTML" },
      intent: "Save the report as a standalone HTML file",
      expectedOutcome: "browser download clarity-assessment-report.html containing the entered claim",
      resetStrategy: "repeatable", test: "try-clarity: download HTML saves the report" },
    { id: "print-report", control: { role: "button", name: "Print / Save PDF" },
      intent: "Print the report or save it as PDF",
      expectedOutcome: "window.print is invoked and print media renders only the report",
      resetStrategy: "repeatable", test: "try-clarity: print invokes the browser print with a report-only print layout" }
  ],
  "contact": [
    { id: "submit-application", control: { role: "button", name: "Submit application" },
      intent: "Send the cohort application to the inquiry service",
      expectedOutcome: "status confirms receipt only after the service answers ok; the form resets",
      resetStrategy: "form resets after success", test: "contact: submission success is confirmed only after the service accepts it" },
    { id: "submit-application-failure", control: { role: "button", name: "Submit application" },
      intent: "Report a refused or failed submission",
      expectedOutcome: "status says Not sent with the reason, entries are kept, and a retry succeeds",
      resetStrategy: "retry", test: "contact: failed submission keeps entries and a retry recovers" }
  ]
});

// Declared peer alignment groups (ULI-L01/L02/L07/L10). Only peers that
// share a row by design are declared; widths list where they share a row.
// Below those widths the rows wrap by design (ULI-L10); the per-width layout
// tests cover that wrapped controls stay on screen without overflow.
export const ALIGNMENT_GROUPS = Object.freeze({
  "home": [
    { id: "home-hero-ctas", relation: "top-edge", edges: ["top", "bottom"], widths: [390, 768, 1280],
      targets: [{ role: "link", name: "Try Clarity", scope: "main" }, { role: "link", name: "Download Template" }],
      rationale: "ULI-L10/L02: the two hero calls to action share a row and equal height" }
  ],
  "try-clarity": [
    { id: "decision-now-choices", relation: "top-edge", edges: ["top", "bottom"], widths: [390, 768, 1280],
      targets: [{ role: "radio", name: "Yes" }, { role: "radio", name: "Not yet clear" }, { role: "radio", name: "No" }],
      rationale: "ULI-L01/L02: one choice row; equal pill geometry" },
    { id: "confidence-choices", relation: "top-edge", edges: ["top", "bottom"], widths: [390, 768, 1280],
      targets: [{ role: "radio", name: "Low" }, { role: "radio", name: "Moderate" }, { role: "radio", name: "High" }],
      rationale: "ULI-L01/L02: one choice row; equal pill geometry" },
    { id: "report-actions", relation: "top-edge", edges: ["top", "bottom"], widths: [768, 1280], requiresReport: true,
      targets: [{ role: "button", name: "Print / Save PDF" }, { role: "button", name: "Download HTML" }, { role: "button", name: "Copy Markdown" }],
      rationale: "ULI-L10/L02/L07: report actions share one edge and button geometry" }
  ],
  "contact": [
    { id: "name-email-row", relation: "top-edge", edges: ["top"], widths: [768, 1280],
      targets: [{ role: "textbox", name: "Name" }, { role: "textbox", name: "Email" }],
      rationale: "ULI-L01: Name and Email are peer fields in one form row from 700px" }
  ],
  "not-found": [
    { id: "not-found-ctas", relation: "top-edge", edges: ["top", "bottom"], widths: [768, 1280],
      targets: [{ role: "link", name: "Go to home" }, { role: "link", name: "Apply for the 2-day cohort" }],
      rationale: "ULI-L10/L02: recovery links share a row and equal height" }
  ]
});

export const alignmentTestTitle = (pageId, groupId) => `alignment: ${pageId} ${groupId}`;
export const layoutTestTitle = (pageId, width) => `layout: ${pageId} at ${width}px`;
export const textScaleTestTitle = (pageId, width) => `layout: ${pageId} at ${width}px with 200% text`;
export const linksTestTitle = pageId => `actions: ${pageId} links reach meaningful destinations`;
export const inventoryTestTitle = pageId => `actions: ${pageId} has no undeclared controls`;
export const TEXT_SCALE_WIDTHS = Object.freeze([320, 390]);

// In-content links (beyond the primary nav) with the test that exercises
// them. Every other link is covered by the per-page destination test.
export const CONTENT_LINKS = Object.freeze({
  "home": [
    { id: "hero-try-clarity", control: { role: "link", name: "Try Clarity" }, intent: "Start the interactive assessment",
      expectedOutcome: "navigates to try-clarity.html", test: "actions: home calls to action open Try Clarity and download the template" },
    { id: "hero-download-template", control: { role: "link", name: "Download Template" }, intent: "Download the Markdown template",
      expectedOutcome: "browser download clarity-quick-assessment-v1.md", test: "actions: home calls to action open Try Clarity and download the template" }
  ],
  "starter-kit": [
    { id: "download-markdown", control: { role: "link", name: "Download Markdown →" }, intent: "Download the Markdown template",
      expectedOutcome: "browser download clarity-quick-assessment-v1.md", test: "actions: starter kit downloads both template formats" },
    { id: "download-html", control: { role: "link", name: "Download HTML →" }, intent: "Download the printable HTML template",
      expectedOutcome: "browser download clarity-quick-assessment-v1.html", test: "actions: starter kit downloads both template formats" }
  ],
  "try-clarity": [
    { id: "skip-link", control: { role: "link", name: "Skip to assessment" }, intent: "Bypass the header",
      expectedOutcome: "first Tab stop, visible when focused, moves to #main", test: "actions: skip link moves focus to the assessment" }
  ],
  "not-found": [
    { id: "go-home", control: { role: "link", name: "Go to home" }, intent: "Recover from a missing page",
      expectedOutcome: "navigates to index.html from any depth", test: "layout: nested 404 keeps the site styles and working recovery links" }
  ]
});

export const NAV_TESTS = Object.freeze([
  "actions: primary navigation is identical on every Clarity page",
  "actions: every primary navigation link navigates to its page"
]);
