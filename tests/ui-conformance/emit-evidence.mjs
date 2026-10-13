// Turns the Playwright JSON report into conformance evidence for
// visual-engineering/UI-LAYOUT-INTERACTION@1.0.0 and validates it against the
// pinned evidence schema. A declared item whose test is missing, skipped or
// failed is never reported as pass (missing evidence is `unknown`).
//
// Usage: node emit-evidence.mjs [report.json] [out.json]
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { CONTRACT_WIDTHS } from "./vendor/forma-conformance/evaluate.mjs";
import {
  ALIGNMENT_GROUPS, CLASSIFICATION, CONTENT_LINKS, CONTROLS, NAV_TESTS, PAGES, PRIMARY_NAV,
  REDIRECTS, REPOSITORY, TEXT_SCALE_WIDTHS, alignmentTestTitle, inventoryTestTitle,
  layoutTestTitle, linksTestTitle, textScaleTestTitle
} from "./contract.mjs";

const [reportPath = "reports/results.json", outPath = "reports/ui-conformance-evidence.json"] = process.argv.slice(2);
// Verbatim copy of visual-engineering framework/contracts/ui-conformance.schema.json
// (standardVersion 1.0.0) at visual-engineering main 8da8fbc.
const schemaUrl = new URL("./vendor/visual-engineering/ui-conformance.schema.json", import.meta.url);

const flattenSpecs = suite => [
  ...(suite.specs ?? []).map(spec => ({ title: spec.title, results: spec.tests.flatMap(t => t.results.map(r => r.status)) })),
  ...(suite.suites ?? []).flatMap(flattenSpecs)
];

// passed | failed | unknown for one test title.
const outcomeOf = specs => title => {
  const statuses = specs.filter(spec => spec.title === title).flatMap(spec => spec.results);
  if (statuses.length === 0 || statuses.includes("skipped")) return "unknown";
  return statuses.every(status => status === "passed") ? "pass" : "fail";
};

const combine = statuses =>
  statuses.includes("fail") ? "fail" : statuses.includes("unknown") || statuses.length === 0 ? "unknown" : "pass";

const evidenceFor = (titles, status) => (status === "pass" ? titles.map(title => `playwright: ${title}`) : []);

const toAction = outcome => entry => {
  const status = outcome(entry.test);
  return {
    id: entry.id,
    control: { role: entry.control.role, name: entry.control.name },
    intent: entry.intent,
    expectedOutcome: entry.expectedOutcome,
    status,
    evidence: evidenceFor([entry.test], status),
    ...(entry.resetStrategy ? { resetStrategy: entry.resetStrategy } : {})
  };
};

const navActions = (surface, outcome) => surface.nav !== "primary" ? [] : PRIMARY_NAV.map(([name, href]) => {
  const status = combine(NAV_TESTS.map(outcome));
  return {
    id: `nav-${href.replace(/\.html$/, "")}`,
    control: { role: "link", name },
    intent: `Navigate to ${href}`,
    expectedOutcome: `navigates to ${href} and shows its level-1 heading`,
    status,
    evidence: evidenceFor(NAV_TESTS, status)
  };
});

const toGroup = (surface, outcome) => group => {
  const title = alignmentTestTitle(surface.id, group.id);
  const status = outcome(title);
  return {
    id: group.id,
    relation: group.relation,
    toleranceCssPx: 1,
    targets: group.targets.map(({ role, name }) => ({ role, name })),
    rationale: `${group.rationale}; measured edges ${group.edges.join("+")} at ${group.widths.join("/")}px`,
    evidence: evidenceFor([title], status)
  };
};

const UNKNOWN_SCOPE = Object.freeze([
  "WebKit and Firefox rendering (Chromium only)",
  "Right-to-left and translated text (site ships English only)",
  "Touch input on real devices"
]);

const surfaceOf = outcome => surface => {
  const groups = ALIGNMENT_GROUPS[surface.id] ?? [];
  const declared = [...(CONTROLS[surface.id] ?? []), ...(CONTENT_LINKS[surface.id] ?? [])];
  const titles = [
    ...CONTRACT_WIDTHS.map(width => layoutTestTitle(surface.id, width)),
    ...TEXT_SCALE_WIDTHS.map(width => textScaleTestTitle(surface.id, width)),
    linksTestTitle(surface.id),
    inventoryTestTitle(surface.id),
    ...groups.map(group => alignmentTestTitle(surface.id, group.id)),
    ...declared.map(entry => entry.test),
    ...(surface.nav === "primary" ? NAV_TESTS : [])
  ];
  const unique = [...new Set(titles)];
  const status = combine(unique.map(outcome));
  return {
    id: surface.id,
    path: `/${surface.path}`,
    kind: surface.kind,
    status,
    viewportWidths: [...CONTRACT_WIDTHS],
    alignmentGroups: groups.map(toGroup(surface, outcome)),
    actions: [...navActions(surface, outcome), ...declared.map(toAction(outcome))],
    evidence: evidenceFor(unique, status),
    unknownScope: [
      ...UNKNOWN_SCOPE,
      ...(groups.length === 0 ? ["No side-by-side peer controls declared on this page (alignment not applicable)"] : [])
    ]
  };
};

const extraSurfaces = outcome => {
  const redirectTitles = REDIRECTS.map(([from, to]) => `actions: legacy ${from} redirects to ${to}`);
  const redirectStatus = combine(redirectTitles.map(outcome));
  const jekyllTitle = "contact: the Jekyll /contact/ page loads its form script and submits";
  const jekyllStatus = outcome(jekyllTitle);
  return [
    {
      id: "legacy-redirects", path: REDIRECTS.map(([from]) => `/${from}`).join(" "), kind: "other",
      status: redirectStatus, viewportWidths: [], alignmentGroups: [],
      actions: [], evidence: evidenceFor(redirectTitles, redirectStatus),
      unknownScope: ["Meta-refresh stubs have no layout of their own"]
    },
    {
      id: "jekyll-contact", path: "/contact/", kind: "marketing",
      status: jekyllStatus === "pass" ? "unknown" : jekyllStatus, viewportWidths: [], alignmentGroups: [],
      actions: [{
        id: "send-message", control: { role: "button", name: "Send message" },
        intent: "Send a contact message to the inquiry service",
        expectedOutcome: "the form script loads from /js/contact.js and confirms receipt after the service answers ok",
        status: jekyllStatus, evidence: evidenceFor([jekyllTitle], jekyllStatus)
      }],
      evidence: evidenceFor([jekyllTitle], jekyllStatus),
      unknownScope: ["Rendered by GitHub Pages Jekyll with the default theme layout, which is not reproduced locally; only the page body and its script wiring are tested, so layout is unknown"]
    }
  ];
};

const revision = () =>
  process.env.GITHUB_SHA ?? execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

const main = async () => {
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  const specs = (report.suites ?? []).flatMap(flattenSpecs);
  const outcome = outcomeOf(specs);
  const evidence = {
    standardVersion: "1.0.0",
    repository: REPOSITORY,
    revision: revision(),
    classification: CLASSIFICATION,
    surfaces: [...PAGES.map(surfaceOf(outcome)), ...extraSurfaces(outcome)],
    exceptions: [],
    notes: "Static GitHub Pages site (decisionposture.com). Generated by tests/ui-conformance/emit-evidence.mjs from the Playwright report; statuses derive from named tests only."
  };
  const schema = JSON.parse(await readFile(schemaUrl, "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
  if (!validate(evidence)) {
    console.error(JSON.stringify(validate.errors, null, 2));
    process.exit(1);
  }
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(evidence, null, 2)}\n`);
  const totals = evidence.surfaces.flatMap(surface => [surface.status, ...surface.actions.map(action => action.status)])
    .reduce((acc, status) => ({ ...acc, [status]: (acc[status] ?? 0) + 1 }), {});
  console.log(`Evidence written to ${outPath} (schema-valid). Surface+action statuses: ${JSON.stringify(totals)}`);
  const failed = evidence.surfaces.filter(surface => surface.status === "fail").map(surface => surface.id);
  if (failed.length > 0) {
    console.error(`Failing surfaces: ${failed.join(", ")}`);
    process.exit(1);
  }
};

await main();
