(function () {
  const form = document.getElementById("try-clarity-form");
  const summary = document.getElementById("clarity-summary");

  if (!form || !summary) return;

  const fields = {
    assessmentType: document.getElementById("summary-assessment-type"),
    claim: document.getElementById("summary-claim"),
    posture: document.getElementById("summary-posture"),
    evidence: document.getElementById("summary-evidence"),
    assumptions: document.getElementById("summary-assumptions"),
    confidence: document.getElementById("summary-confidence"),
    actionTrigger: document.getElementById("summary-action-trigger"),
    immediateAction: document.getElementById("summary-immediate-action"),
    trigger: document.getElementById("summary-trigger"),
    action: document.getElementById("summary-action"),
    markdown: document.getElementById("summary-markdown"),
  };
  const copyButton = document.getElementById("copy-markdown");
  const downloadButton = document.getElementById("download-report");
  const printButton = document.getElementById("print-report");
  const copyStatus = document.getElementById("copy-status");
  const assessmentTypeInput = document.getElementById("assessment-type");
  const nextActionInput = document.getElementById("next-action");
  const radioInputs = Array.from(form.querySelectorAll('input[type="radio"]'));
  const postureInputs = Array.from(form.querySelectorAll('input[name="posture"]'));
  const confidenceInputs = Array.from(form.querySelectorAll('input[name="confidence"]'));
  const guidanceFields = {
    assessmentType: {
      title: document.getElementById("assessment-type-guidance-title"),
      body: document.getElementById("assessment-type-guidance-body"),
    },
    posture: {
      title: document.getElementById("posture-guidance-title"),
      body: document.getElementById("posture-guidance-body"),
      prompt: document.getElementById("posture-guidance-prompt"),
    },
    confidence: {
      title: document.getElementById("confidence-guidance-title"),
      body: document.getElementById("confidence-guidance-body"),
      prompt: document.getElementById("confidence-guidance-prompt"),
    },
    nextAction: {
      title: document.getElementById("next-action-guidance-title"),
      body: document.getElementById("next-action-guidance-body"),
    },
  };
  let currentMarkdown = "";
  let currentHtmlReport = "";
  let copyResetTimer = null;
  const guidanceContent = {
    assessmentType: {
      Project: {
        title: "Project",
        body: "Use this when a delivery effort, initiative, or plan depends on claims that need to be examined before more work continues.",
      },
      "Product Idea": {
        title: "Product Idea",
        body: "Use this when you are testing whether a proposed feature or offering deserves stronger commitment.",
      },
      Startup: {
        title: "Startup",
        body: "Use this when the claim affects product-market fit, demand, growth, or another early-stage business belief.",
      },
      Architecture: {
        title: "Architecture",
        body: "Use this when the claim concerns technical design, scalability, reliability, or system constraints.",
      },
      Methodology: {
        title: "Methodology",
        body: "Use this when the claim is about whether a process or way of working will improve outcomes.",
      },
      Strategy: {
        title: "Strategy",
        body: "Use this when the claim affects direction, investment, priorities, or other broad organizational commitments.",
      },
      Other: {
        title: "Other",
        body: "Use this when the claim does not fit the common categories but still needs evidence, ownership, and reassessment.",
      },
    },
    posture: {
      Discovery: {
        title: "Discovery",
        body: "Use when the claim is still being explored. We are trying to learn what may be true. Evidence can be incomplete, and the goal is to reduce uncertainty.",
        prompt: "Helpful prompt: What evidence would help us decide whether this claim deserves commitment?",
      },
      Commitment: {
        title: "Commitment",
        body: "Use when the organization or person is acting as if the claim is true. Resources, plans, or actions are being based on this claim. Evidence and ownership should be stronger.",
        prompt: "Helpful prompt: Is the evidence strong enough for the consequences of being wrong?",
      },
      Reassessment: {
        title: "Reassessment",
        body: "Use when an existing belief or commitment needs to be reviewed. Something may have changed. The question is whether the original claim still holds.",
        prompt: "Helpful prompt: What changed, and does the claim still match reality?",
      },
    },
    confidence: {
      Low: {
        title: "Low",
        body: "The claim may be plausible, but evidence is limited or uncertain.",
        prompt: "Guidance: Treat this as Discovery unless the decision is highly correctable.",
      },
      Moderate: {
        title: "Moderate",
        body: "There is some supporting evidence, but important assumptions or gaps remain.",
        prompt: "Guidance: Proceed carefully and define clear reassessment triggers.",
      },
      High: {
        title: "High",
        body: "The claim is strongly supported by evidence and has survived meaningful challenge.",
        prompt: "Guidance: Make sure confidence does not exceed evidence, especially if consequences are high.",
      },
    },
    nextAction: {
      Proceed: {
        title: "Proceed",
        body: "Use when evidence is sufficient for the current level of risk and correctability.",
      },
      "Gather evidence": {
        title: "Gather Evidence",
        body: "Use when the claim is plausible but evidence is not yet strong enough.",
      },
      "Reduce scope": {
        title: "Reduce Scope",
        body: "Use when action is worthwhile but uncertainty or consequence is too high for full commitment.",
      },
      Reassess: {
        title: "Reassess",
        body: "Use when new evidence, changed conditions, or failed assumptions require review.",
      },
      Adapt: {
        title: "Adapt",
        body: "Use when reality has changed enough that the current plan should change.",
      },
    },
  };

  function readValue(formData, key) {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() ? value.trim() : "Not provided.";
  }

  function syncChoiceState() {
    radioInputs.forEach(function (input) {
      const pill = input.closest(".choice-pill");
      if (!pill) return;
      pill.classList.toggle("is-selected", input.checked);
    });
  }

  function setGuidance(group, content) {
    const targets = guidanceFields[group];
    if (!targets || !content) return;
    if (targets.title) targets.title.textContent = content.title || "";
    if (targets.body) targets.body.textContent = content.body || "";
    if (targets.prompt) targets.prompt.textContent = content.prompt || "";
  }

  function findCheckedValue(inputs) {
    const match = inputs.find(function (input) {
      return input.checked;
    });
    return match ? match.value : "";
  }

  function syncGuidance() {
    const assessmentTypeValue = assessmentTypeInput ? assessmentTypeInput.value : "";
    const postureValue = findCheckedValue(postureInputs);
    const confidenceValue = findCheckedValue(confidenceInputs);
    const nextActionValue = nextActionInput ? nextActionInput.value : "";

    setGuidance("assessmentType", guidanceContent.assessmentType[assessmentTypeValue]);
    setGuidance("posture", guidanceContent.posture[postureValue] || {
      title: "Choose a posture",
      body: "Pick the posture that best matches whether the claim is being explored, actively relied on, or reviewed again.",
      prompt: "",
    });
    setGuidance("confidence", guidanceContent.confidence[confidenceValue] || {
      title: "Choose a confidence level",
      body: "Select the level that best fits the quality of the evidence supporting the claim.",
      prompt: "",
    });
    setGuidance("nextAction", guidanceContent.nextAction[nextActionValue] || {
      title: "Choose a recommended action",
      body: "Select the action that best matches what should happen next given the current evidence and risk.",
    });
  }

  function setCopyStatus(message) {
    if (!copyStatus) return;
    copyStatus.textContent = message;
  }

  function clearCopyStatusLater() {
    if (copyResetTimer) {
      window.clearTimeout(copyResetTimer);
    }
    copyResetTimer = window.setTimeout(function () {
      setCopyStatus("");
    }, 1600);
  }

  function buildMarkdown(values) {
    return [
      "# Clarity Assessment Report",
      "",
      "## Assessment Type",
      values.assessmentType,
      "",
      "## Claim",
      values.claim,
      "",
      "## Posture",
      values.posture,
      "",
      "## Evidence",
      values.evidence,
      "",
      "## Assumptions",
      values.assumptions,
      "",
      "## Confidence",
      values.confidence,
      "",
      "## Action Trigger",
      values.actionTrigger,
      "",
      "## Immediate Action",
      values.immediateAction,
      "",
      "## Reassessment Trigger",
      values.trigger,
      "",
      "## Reflection Questions",
      "- Does confidence exceed evidence?",
      "- Are assumptions being treated as facts?",
      "- What would require immediate action before deeper reassessment?",
      "- What evidence would reduce uncertainty?",
      "- Who owns the consequences?",
      "- What is the next reasonable action?",
      "",
      "## Recommended Next Action",
      values.action,
    ].join("\n");
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function reportSection(title, value, wide) {
    return [
      '<section class="report-card',
      wide ? ' report-card-wide' : "",
      '">',
      "<h3>",
      escapeHtml(title),
      "</h3>",
      "<p>",
      escapeHtml(value),
      "</p>",
      "</section>",
    ].join("");
  }

  function buildHtmlReport(values) {
    const reflections = [
      "Does confidence exceed evidence?",
      "Are assumptions being treated as facts?",
      "What would require immediate action before deeper reassessment?",
      "What evidence would reduce uncertainty?",
      "Who owns the consequences?",
      "What is the next reasonable action?",
    ];

    return [
      "<!doctype html>",
      '<html lang="en">',
      "<head>",
      '<meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      "<title>Clarity Assessment Report</title>",
      "<style>",
      "body{margin:0;padding:32px;background:#f8fafc;color:#0f172a;font:16px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}",
      "main{max-width:960px;margin:0 auto;}",
      "h1,h2,h3,p{margin:0;}",
      ".report-shell{background:#fff;border:1px solid #d7dee8;border-radius:18px;padding:28px;}",
      ".report-kicker{margin-bottom:8px;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:#475569;font-weight:700;}",
      ".report-copy{margin-top:10px;color:#475569;}",
      ".report-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:24px;}",
      ".report-card{border:1px solid #d7dee8;border-radius:14px;padding:18px;background:#fff;break-inside:avoid-page;}",
      ".report-card-wide{grid-column:1 / -1;}",
      ".report-card h3{margin-bottom:10px;font-size:1rem;color:#0f172a;}",
      ".report-card p,.report-card li{color:#334155;white-space:pre-wrap;}",
      ".report-list{margin:0;padding-left:20px;}",
      ".report-list li+li{margin-top:8px;}",
      "@media (max-width:700px){body{padding:16px}.report-shell{padding:18px}.report-grid{grid-template-columns:1fr;}.report-card-wide{grid-column:auto;}}",
      "@media print{body{padding:0;background:#fff}.report-shell{border:none;border-radius:0;padding:0}main{max-width:none}.report-grid{gap:12px}}",
      "</style>",
      "</head>",
      "<body>",
      "<main>",
      '<article class="report-shell">',
      '<p class="report-kicker">Completed assessment</p>',
      "<h1>Clarity Assessment Report</h1>",
      '<p class="report-copy">A plainspoken assessment summary designed to be shared, printed, or saved.</p>',
      '<div class="report-grid">',
      reportSection("Assessment Type", values.assessmentType, true),
      reportSection("Claim", values.claim, true),
      reportSection("Posture", values.posture, false),
      reportSection("Confidence", values.confidence, false),
      reportSection("Evidence", values.evidence, true),
      reportSection("Assumptions", values.assumptions, true),
      reportSection("Action Trigger", values.actionTrigger, false),
      reportSection("Immediate Action", values.immediateAction, false),
      reportSection("Reassessment Trigger", values.trigger, true),
      reportSection("Recommended Action", values.action, true),
      '<section class="report-card report-card-wide"><h3>Reflection Questions</h3><ul class="report-list">',
      reflections.map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join(""),
      "</ul></section>",
      "</div>",
      "</article>",
      "</main>",
      "</body>",
      "</html>",
    ].join("");
  }

  async function copyMarkdown() {
    if (!currentMarkdown) return;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(currentMarkdown);
      } else {
        const helper = document.createElement("textarea");
        helper.value = currentMarkdown;
        helper.setAttribute("readonly", "readonly");
        helper.style.position = "absolute";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        document.body.removeChild(helper);
      }

      setCopyStatus("Copied");
      clearCopyStatusLater();
    } catch (error) {
      setCopyStatus("Copy failed");
    }
  }

  function downloadHtmlReport() {
    if (!currentHtmlReport) return;

    const blob = new Blob([currentHtmlReport], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clarity-assessment-report.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  radioInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      syncChoiceState();
      syncGuidance();
    });
  });

  if (assessmentTypeInput) {
    assessmentTypeInput.addEventListener("change", syncGuidance);
  }

  if (nextActionInput) {
    nextActionInput.addEventListener("change", syncGuidance);
  }

  if (copyButton) {
    copyButton.addEventListener("click", copyMarkdown);
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", downloadHtmlReport);
  }

  if (printButton) {
    printButton.addEventListener("click", function () {
      if (!summary.hidden) {
        window.print();
      }
    });
  }

  syncChoiceState();
  syncGuidance();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const values = {
      assessmentType: readValue(formData, "assessment_type"),
      claim: readValue(formData, "claim"),
      posture: readValue(formData, "posture"),
      evidence: readValue(formData, "evidence"),
      assumptions: readValue(formData, "assumptions"),
      confidence: readValue(formData, "confidence"),
      actionTrigger: readValue(formData, "action_trigger"),
      immediateAction: readValue(formData, "recommended_action"),
      trigger: readValue(formData, "reassessment_trigger"),
      action: readValue(formData, "next_action"),
    };

    fields.assessmentType.textContent = values.assessmentType;
    fields.claim.textContent = values.claim;
    fields.posture.textContent = values.posture;
    fields.evidence.textContent = values.evidence;
    fields.assumptions.textContent = values.assumptions;
    fields.confidence.textContent = values.confidence;
    fields.actionTrigger.textContent = values.actionTrigger;
    fields.immediateAction.textContent = values.immediateAction;
    fields.trigger.textContent = values.trigger;
    fields.action.textContent = values.action;

    currentMarkdown = buildMarkdown(values);
    currentHtmlReport = buildHtmlReport(values);
    fields.markdown.textContent = currentMarkdown;

    summary.hidden = false;
    setCopyStatus("");
    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // TODO: Add JSON export for future Clarity Audit / reassessment workflows.
})();
