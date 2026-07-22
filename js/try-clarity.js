(function () {
  const form = document.getElementById("try-clarity-form");
  const summary = document.getElementById("clarity-summary");

  if (!form || !summary) return;

  const fields = {
    claim: document.getElementById("summary-claim"),
    context: document.getElementById("summary-context"),
    posture: document.getElementById("summary-posture"),
    evidence: document.getElementById("summary-evidence"),
    assumptions: document.getElementById("summary-assumptions"),
    confidence: document.getElementById("summary-confidence"),
    correctability: document.getElementById("summary-correctability"),
    decisionNow: document.getElementById("summary-decision-now"),
    whatChanged: document.getElementById("summary-what-changed"),
    changedCard: document.getElementById("summary-changed-card"),
    owner: document.getElementById("summary-owner"),
    monitoringSignal: document.getElementById("summary-monitoring-signal"),
    threshold: document.getElementById("summary-threshold"),
    triggerClaim: document.getElementById("summary-trigger-claim"),
    actionTrigger: document.getElementById("summary-action-trigger"),
    immediateResponse: document.getElementById("summary-immediate-response"),
    reassessmentTrigger: document.getElementById("summary-reassessment-trigger"),
    triggerReassessment: document.getElementById("summary-trigger-reassessment"),
    recommendation: document.getElementById("summary-recommendation"),
    note: document.getElementById("summary-note"),
    noteCard: document.getElementById("summary-note-card"),
    markdown: document.getElementById("summary-markdown"),
  };
  const copyButton = document.getElementById("copy-markdown");
  const downloadButton = document.getElementById("download-report");
  const printButton = document.getElementById("print-report");
  const copyStatus = document.getElementById("copy-status");
  const radioInputs = Array.from(form.querySelectorAll('input[type="radio"]'));
  const postureInputs = Array.from(form.querySelectorAll('input[name="posture"]'));
  const confidenceInputs = Array.from(form.querySelectorAll('input[name="confidence"]'));
  const reassessmentChangeField = document.getElementById("reassessment-change-field");
  const recommendationTitle = document.getElementById("recommendation-title");
  const recommendationBody = document.getElementById("recommendation-body");
  const guidanceFields = {
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
  };
  let currentMarkdown = "";
  let currentHtmlReport = "";
  let copyResetTimer = null;
  const guidanceContent = {
    posture: {
      Discovery: {
        title: "Discovery favors learning over defense.",
        body: "Use this when the claim is still being explored. The goal is to reduce uncertainty, not act more certain than the evidence allows.",
        prompt: "Helpful prompt: What evidence would move this claim from plausible to justified?",
      },
      Commitment: {
        title: "Commitment means the claim is guiding live action.",
        body: "Use this when resources, timelines, policy, or execution already depend on the claim. Evidence, ownership, and trigger quality should be stronger here.",
        prompt: "Helpful prompt: Is the evidence strong enough for the consequences and correctability of being wrong?",
      },
      Reassessment: {
        title: "Reassessment means a once-accepted claim is back under review.",
        body: "Use this when time, outcomes, or new evidence suggest the original claim may no longer fit reality.",
        prompt: "Helpful prompt: What changed, and what would tell us the old claim should be revised or retired?",
      },
    },
    confidence: {
      Low: {
        title: "Low confidence should slow commitment.",
        body: "The claim may be plausible, but the evidence is still weak, incomplete, or contested.",
        prompt: "Guidance: If a decision is still required now, reduce scope or increase correctability.",
      },
      Moderate: {
        title: "Moderate confidence means the claim is usable but still exposed.",
        body: "There is some support, but important assumptions or gaps remain.",
        prompt: "Guidance: Make the owner, monitoring signal, and reassessment path explicit.",
      },
      High: {
        title: "High confidence still needs explicit challenge.",
        body: "The claim appears strongly supported, but it still needs an owner and a trigger model so action does not drift unquestioned.",
        prompt: "Guidance: High confidence is strongest when the trigger model is also explicit and credible.",
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
    const postureValue = findCheckedValue(postureInputs);
    const confidenceValue = findCheckedValue(confidenceInputs);
    setGuidance("posture", guidanceContent.posture[postureValue] || {
      title: "Choose the claim posture.",
      body: "Pick the posture that best matches whether the claim is still being explored, already guiding action, or being reviewed again.",
      prompt: "",
    });
    setGuidance("confidence", guidanceContent.confidence[confidenceValue] || {
      title: "Choose the confidence level.",
      body: "Select the level that best matches the current evidence, not the hoped-for outcome.",
      prompt: "",
    });
  }

  function readFormState() {
    const formData = new FormData(form);
    return {
      claim: readValue(formData, "claim"),
      context: readValue(formData, "claim_context"),
      posture: readValue(formData, "posture"),
      decisionNow: readValue(formData, "decision_now"),
      whatChanged: readValue(formData, "what_changed"),
      evidence: readValue(formData, "evidence"),
      assumptions: readValue(formData, "assumptions"),
      confidence: readValue(formData, "confidence"),
      correctability: readValue(formData, "correctability"),
      owner: readValue(formData, "owner"),
      monitoringSignal: readValue(formData, "monitoring_signal"),
      threshold: readValue(formData, "threshold"),
      triggerClaim: readValue(formData, "trigger_claim"),
      actionTrigger: readValue(formData, "action_trigger"),
      immediateResponse: readValue(formData, "immediate_response"),
      reassessmentTrigger: readValue(formData, "reassessment_trigger"),
      triggerReassessment: readValue(formData, "trigger_reassessment"),
      recommendationNote: readValue(formData, "recommendation_note"),
    };
  }

  function inferRecommendation(values) {
    const posture = values.posture;
    const confidence = values.confidence;
    const correctability = values.correctability;
    const decisionNow = values.decisionNow;

    if (posture === "Reassessment") {
      if (confidence === "Low" || values.whatChanged !== "Not provided.") {
        return {
          title: "Reassess before extending commitment.",
          body: "Reality appears to have shifted or the current claim is no longer stable. Rework the claim, owner, and trigger model before continuing unchanged.",
        };
      }
      return {
        title: "Adapt with explicit monitoring.",
        body: "The claim is under review. Tighten the updated trigger model, capture what changed, and adjust the current plan rather than assuming the earlier commitment still holds.",
      };
    }

    if (posture === "Discovery") {
      if (decisionNow === "Yes" && correctability === "Low") {
        return {
          title: "Reduce scope before committing.",
          body: "A live decision is needed, but low correctability and exploratory posture make full commitment hard to justify. Shrink the bet or increase recovery options first.",
        };
      }
      if (confidence === "High" && correctability === "High") {
        return {
          title: "Proceed with constrained commitment.",
          body: "The claim appears usable for a small, correctable step. Move forward, but preserve the monitoring and reassessment path.",
        };
      }
      return {
        title: "Gather evidence before stronger commitment.",
        body: "Discovery posture usually means learning is the next move. Identify the evidence that would justify commitment rather than relying on confidence alone.",
      };
    }

    if (posture === "Commitment") {
      if (confidence === "Low") {
        return {
          title: "Reduce scope and gather evidence.",
          body: "The claim is already guiding action, but confidence is weak. Lower the exposure, tighten ownership, and collect stronger support before extending commitment.",
        };
      }
      if (correctability === "Low" && confidence !== "High") {
        return {
          title: "Reduce scope before proceeding.",
          body: "Commitment with limited recovery requires stronger support. Narrow the commitment or raise the evidence standard before continuing at full strength.",
        };
      }
      if (confidence === "High") {
        return {
          title: "Proceed with explicit monitoring.",
          body: "The claim appears strong enough for the current commitment. Keep the owner, signal, threshold, and reassessment path visible so the commitment stays revisable.",
        };
      }
    }

    return {
      title: "Complete the evidence-to-action chain.",
      body: "The claim may be worth acting on, but the next move should follow from the posture, evidence quality, correctability, and trigger model together.",
    };
  }

  function syncConditionalState() {
    const postureValue = findCheckedValue(postureInputs);
    if (reassessmentChangeField) {
      const isReassessment = postureValue === "Reassessment";
      reassessmentChangeField.hidden = !isReassessment;
      const textarea = reassessmentChangeField.querySelector("textarea");
      if (textarea) {
        textarea.required = isReassessment;
      }
    }
  }

  function syncRecommendationPreview() {
    if (!recommendationTitle || !recommendationBody) return;
    const values = readFormState();
    const recommendation = inferRecommendation(values);
    recommendationTitle.textContent = recommendation.title;
    recommendationBody.textContent = recommendation.body;
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
    const sections = [
      "# Clarity Assessment Report",
      "",
      "## Claim",
      values.claim,
      "",
      "## Posture",
      values.posture,
      "",
      "## Decision Required Now",
      values.decisionNow,
    ];

    if (values.context !== "Not provided.") {
      sections.push("", "## Context", values.context);
    }

    if (values.whatChanged !== "Not provided.") {
      sections.push("", "## What Changed", values.whatChanged);
    }

    const output = sections.concat([
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
      "## Correctability",
      values.correctability,
      "",
      "## Owner",
      values.owner,
      "",
      "## Monitoring Signal",
      values.monitoringSignal,
      "",
      "## Threshold",
      values.threshold,
      "",
      "## Trigger Claim",
      values.triggerClaim,
      "",
      "## Immediate Action Trigger",
      values.actionTrigger,
      "",
      "## Immediate Response",
      values.immediateResponse,
      "",
      "## Reassessment Trigger",
      values.reassessmentTrigger,
      "",
      "## Trigger Reassessment",
      values.triggerReassessment,
      "",
      "## Generated Recommendation",
      values.recommendation.title,
      "",
      values.recommendation.body,
      "",
      "## Reflection Questions",
      "- Does confidence exceed what the evidence can currently justify?",
      "- Are assumptions being treated as facts?",
      "- Who owns the consequences if the claim is wrong?",
      "- What would force immediate response versus deeper reassessment?",
      "- What would invalidate the trigger model itself?",
    ]);

    if (values.recommendationNote !== "Not provided.") {
      output.push("", "## Operator Note", values.recommendationNote);
    }

    return output.join("\n");
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
      "Does confidence exceed what the evidence can currently justify?",
      "Are assumptions being treated as facts?",
      "Who owns the consequences if the claim is wrong?",
      "What would force immediate response versus deeper reassessment?",
      "What would invalidate the trigger model itself?",
    ];

    const sections = [
      reportSection("Claim", values.claim, true),
      reportSection("Context", values.context, false),
      reportSection("Posture", values.posture, false),
      reportSection("Decision Required Now", values.decisionNow, false),
      reportSection("Confidence", values.confidence, false),
      reportSection("Correctability", values.correctability, false),
    ];

    if (values.whatChanged !== "Not provided.") {
      sections.push(reportSection("What Changed", values.whatChanged, true));
    }

    sections.push(
      reportSection("Evidence", values.evidence, true),
      reportSection("Assumptions", values.assumptions, true),
      reportSection("Owner", values.owner, false),
      reportSection("Monitoring Signal", values.monitoringSignal, false),
      reportSection("Threshold", values.threshold, false),
      reportSection("Trigger Claim", values.triggerClaim, false),
      reportSection("Immediate Action Trigger", values.actionTrigger, false),
      reportSection("Immediate Response", values.immediateResponse, false),
      reportSection("Reassessment Trigger", values.reassessmentTrigger, false),
      reportSection("Trigger Reassessment", values.triggerReassessment, false),
      reportSection("Generated Recommendation", values.recommendation.title + "\n\n" + values.recommendation.body, true)
    );

    if (values.recommendationNote !== "Not provided.") {
      sections.push(reportSection("Operator Note", values.recommendationNote, true));
    }

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
      '<p class="report-copy">A local summary of the claim, current justification, monitoring model, and recommended next move.</p>',
      '<div class="report-grid">',
      sections.join(""),
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
      syncConditionalState();
      syncRecommendationPreview();
    });
  });

  Array.from(form.querySelectorAll("textarea, input[type='text'], select")).forEach(function (input) {
    input.addEventListener("input", syncRecommendationPreview);
    input.addEventListener("change", syncRecommendationPreview);
  });

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
  syncConditionalState();
  syncRecommendationPreview();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const values = readFormState();
    values.recommendation = inferRecommendation(values);

    fields.claim.textContent = values.claim;
    fields.context.textContent = values.context;
    fields.posture.textContent = values.posture;
    fields.decisionNow.textContent = values.decisionNow;
    fields.whatChanged.textContent = values.whatChanged;
    fields.changedCard.hidden = values.whatChanged === "Not provided.";
    fields.evidence.textContent = values.evidence;
    fields.assumptions.textContent = values.assumptions;
    fields.confidence.textContent = values.confidence;
    fields.correctability.textContent = values.correctability;
    fields.owner.textContent = values.owner;
    fields.monitoringSignal.textContent = values.monitoringSignal;
    fields.threshold.textContent = values.threshold;
    fields.triggerClaim.textContent = values.triggerClaim;
    fields.actionTrigger.textContent = values.actionTrigger;
    fields.immediateResponse.textContent = values.immediateResponse;
    fields.reassessmentTrigger.textContent = values.reassessmentTrigger;
    fields.triggerReassessment.textContent = values.triggerReassessment;
    fields.recommendation.textContent = values.recommendation.title + " " + values.recommendation.body;
    fields.note.textContent = values.recommendationNote;
    fields.noteCard.hidden = values.recommendationNote === "Not provided.";

    currentMarkdown = buildMarkdown(values);
    currentHtmlReport = buildHtmlReport(values);
    fields.markdown.textContent = currentMarkdown;

    summary.hidden = false;
    setCopyStatus("");
    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // TODO: Add JSON export for future Clarity Audit / reassessment workflows.
})();
