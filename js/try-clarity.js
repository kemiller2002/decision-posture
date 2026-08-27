(function () {
  const form = document.getElementById("try-clarity-form");
  const summary = document.getElementById("clarity-summary");

  if (!form || !summary) return;

  const fields = {
    claim: document.getElementById("summary-claim"),
    context: document.getElementById("summary-context"),
    posture: document.getElementById("summary-posture"),
    decisionNow: document.getElementById("summary-decision-now"),
    confidence: document.getElementById("summary-confidence"),
    correctability: document.getElementById("summary-correctability"),
    whatChanged: document.getElementById("summary-what-changed"),
    changedCard: document.getElementById("summary-changed-card"),
    evidence: document.getElementById("summary-evidence"),
    assumptions: document.getElementById("summary-assumptions"),
    owner: document.getElementById("summary-owner"),
    mindChange: document.getElementById("summary-mind-change"),
    monitoringSignal: document.getElementById("summary-monitoring-signal"),
    monitoringSignalCard: document.getElementById("summary-monitoring-signal-card"),
    threshold: document.getElementById("summary-threshold"),
    thresholdCard: document.getElementById("summary-threshold-card"),
    triggerClaim: document.getElementById("summary-trigger-claim"),
    triggerClaimCard: document.getElementById("summary-trigger-claim-card"),
    actionTrigger: document.getElementById("summary-action-trigger"),
    actionTriggerCard: document.getElementById("summary-action-trigger-card"),
    immediateResponse: document.getElementById("summary-immediate-response"),
    immediateResponseCard: document.getElementById("summary-immediate-response-card"),
    reassessmentTrigger: document.getElementById("summary-reassessment-trigger"),
    reassessmentTriggerCard: document.getElementById("summary-reassessment-trigger-card"),
    triggerReassessment: document.getElementById("summary-trigger-reassessment"),
    triggerReassessmentCard: document.getElementById("summary-trigger-reassessment-card"),
    recommendation: document.getElementById("summary-recommendation"),
    note: document.getElementById("summary-note"),
    noteCard: document.getElementById("summary-note-card"),
    markdown: document.getElementById("summary-markdown"),
  };

  const copyButton = document.getElementById("copy-markdown");
  const downloadButton = document.getElementById("download-report");
  const printButton = document.getElementById("print-report");
  const copyStatus = document.getElementById("copy-status");
  const recommendationTitle = document.getElementById("recommendation-title");
  const recommendationBody = document.getElementById("recommendation-body");
  const reassessmentChangeField = document.getElementById("reassessment-change-field");
  const radioInputs = Array.from(form.querySelectorAll('input[type="radio"]'));
  const postureInputs = Array.from(form.querySelectorAll('input[name="posture"]'));
  const confidenceInputs = Array.from(form.querySelectorAll('input[name="confidence"]'));

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

  const guidanceContent = {
    posture: {
      Discovery: {
        title: "Suggested posture: Discovery",
        body: "This claim looks exploratory. The next move is usually learning, not stronger commitment.",
        prompt: "Helpful prompt: What evidence would make this claim stronger?",
      },
      Commitment: {
        title: "Suggested posture: Commitment",
        body: "This claim appears to be guiding a live decision or action. The next step should match the cost of being wrong.",
        prompt: "Helpful prompt: Is the evidence strong enough for the size of the next step?",
      },
      Reassessment: {
        title: "Suggested posture: Reassessment",
        body: "Something has changed, so the earlier claim should be reviewed before extending commitment.",
        prompt: "Helpful prompt: What changed, and what no longer holds?",
      },
    },
    confidence: {
      Low: {
        title: "Low confidence should stay visible and inform the next move.",
        body: "The claim may be plausible, but the current support is still weak or incomplete.",
        prompt: "Guidance: Consider the size and reversibility of the move without treating uncertainty as an automatic stop.",
      },
      Moderate: {
        title: "Moderate confidence means some support exists.",
        body: "There is real support, but important gaps or assumptions remain.",
        prompt: "Guidance: Keep the owner and the review condition explicit.",
      },
      High: {
        title: "High confidence still needs a way to be revised.",
        body: "The claim appears well-supported, but it should still remain reviewable.",
        prompt: "Guidance: Make sure the next step is proportional to the evidence.",
      },
    },
  };

  let currentMarkdown = "";
  let currentHtmlReport = "";
  let copyResetTimer = null;

  function readValue(formData, key) {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() ? value.trim() : "Not provided.";
  }

  function shouldShow(value) {
    return value !== "Not provided.";
  }

  function syncChoiceState() {
    radioInputs.forEach(function (input) {
      const pill = input.closest(".choice-pill");
      if (!pill) return;
      pill.classList.toggle("is-selected", input.checked);
    });
  }

  function findCheckedValue(inputs) {
    const match = inputs.find(function (input) {
      return input.checked;
    });
    return match ? match.value : "";
  }

  function inferPosture(values) {
    if (shouldShow(values.whatChanged)) return "Reassessment";
    if (values.decisionNow === "Yes") return "Commitment";
    return "Discovery";
  }

  function setGuidance(group, content) {
    const targets = guidanceFields[group];
    if (!targets || !content) return;
    if (targets.title) targets.title.textContent = content.title || "";
    if (targets.body) targets.body.textContent = content.body || "";
    if (targets.prompt) targets.prompt.textContent = content.prompt || "";
  }

  function readFormState() {
    const formData = new FormData(form);
    const explicitPosture = readValue(formData, "posture");
    const values = {
      claim: readValue(formData, "claim"),
      context: readValue(formData, "claim_context"),
      decisionNow: readValue(formData, "decision_now"),
      whatChanged: readValue(formData, "what_changed"),
      evidence: readValue(formData, "evidence"),
      assumptions: readValue(formData, "assumptions"),
      confidence: readValue(formData, "confidence"),
      correctability: readValue(formData, "correctability"),
      owner: readValue(formData, "owner"),
      mindChange: readValue(formData, "mind_change"),
      monitoringSignal: readValue(formData, "monitoring_signal"),
      threshold: readValue(formData, "threshold"),
      triggerClaim: readValue(formData, "trigger_claim"),
      actionTrigger: readValue(formData, "action_trigger"),
      immediateResponse: readValue(formData, "immediate_response"),
      reassessmentTrigger: readValue(formData, "reassessment_trigger"),
      triggerReassessment: readValue(formData, "trigger_reassessment"),
      recommendationNote: readValue(formData, "recommendation_note"),
    };

    const inferred = inferPosture(values);
    values.posture = explicitPosture !== "Not provided." ? explicitPosture : inferred;
    return values;
  }

  function syncGuidance() {
    const values = readFormState();
    const confidenceValue = findCheckedValue(confidenceInputs);

    setGuidance("posture", guidanceContent.posture[values.posture] || {
      title: "Suggested posture",
      body: "The posture will be suggested from the claim state unless you override it.",
      prompt: "",
    });

    setGuidance("confidence", guidanceContent.confidence[confidenceValue] || {
      title: "Choose the confidence level.",
      body: "Select the level that matches the current evidence, not the hoped-for outcome.",
      prompt: "",
    });
  }

  function inferRecommendation(values) {
    const posture = values.posture;
    const confidence = values.confidence;
    const correctability = values.correctability;
    const decisionNow = values.decisionNow;

    if (posture === "Reassessment") {
      return {
        title: "Reassess before extending commitment.",
        body: "Something has changed. Review the claim, update the owner if needed, and decide whether the current plan still fits reality.",
      };
    }

    if (posture === "Discovery") {
      if (decisionNow === "Yes" && correctability === "Hard to recover") {
        return {
          title: "Choose the most defensible commitment available.",
          body: "A live decision is needed and recovery is hard. Use the best information available, make the uncertainty explicit, and reduce exposure where feasible; if waiting is worse, decide without pretending certainty.",
        };
      }
      if (confidence === "High" && correctability === "Easy to recover") {
        return {
          title: "Proceed with a small next step.",
          body: "The claim appears strong enough for a limited, reviewable move. Keep the owner and the mind-change condition visible.",
        };
      }
      return {
        title: "Keep the next move proportionate.",
        body: "Match the move to what is known, what remains uncertain, and the consequences of being wrong. Learn more when worthwhile, or act with the uncertainty explicit.",
      };
    }

    if (posture === "Commitment") {
      if (confidence === "Low") {
        return {
          title: "Decide with the uncertainty visible.",
          body: "The claim is guiding action, but support is weak. Gather more information or reduce exposure when practical; if the cost of waiting is greater, proceed with the assumption, owner, and review condition explicit.",
        };
      }
      if (correctability === "Hard to recover" && confidence !== "High") {
        return {
          title: "Make the justification match the consequences.",
          body: "Recovery is hard and important uncertainty remains. Narrow the commitment or improve the justification where practical; if delay is more consequential, make the decision with that tradeoff explicit.",
        };
      }
      return {
        title: "Proceed, but keep it reviewable.",
        body: "The claim appears strong enough for the current commitment. Keep the owner and the mind-change condition visible so the commitment stays revisable.",
      };
    }

    return {
      title: "Complete the core assessment.",
      body: "The claim may be worth acting on, but the next move should follow from the current evidence, assumptions, and recovery difficulty together.",
    };
  }

  function syncConditionalState() {
    const values = readFormState();
    if (reassessmentChangeField) {
      const isReassessment = values.posture === "Reassessment";
      reassessmentChangeField.hidden = !isReassessment;
      const textarea = reassessmentChangeField.querySelector("textarea");
      if (textarea) textarea.required = isReassessment;
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
    if (copyResetTimer) window.clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(function () {
      setCopyStatus("");
    }, 1600);
  }

  function buildMarkdown(values) {
    const lines = [
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

    if (shouldShow(values.context)) lines.push("", "## Context", values.context);
    if (shouldShow(values.whatChanged)) lines.push("", "## What Changed", values.whatChanged);

    lines.push(
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
      "## Recovery Difficulty",
      values.correctability,
      "",
      "## Owner",
      values.owner,
      "",
      "## What Would Change Your Mind",
      values.mindChange,
      "",
      "## Generated Recommendation",
      values.recommendation.title,
      "",
      values.recommendation.body
    );

    if (shouldShow(values.monitoringSignal)) lines.push("", "## Monitoring Signal", values.monitoringSignal);
    if (shouldShow(values.threshold)) lines.push("", "## Threshold", values.threshold);
    if (shouldShow(values.triggerClaim)) lines.push("", "## Trigger Claim", values.triggerClaim);
    if (shouldShow(values.actionTrigger)) lines.push("", "## Immediate Action Trigger", values.actionTrigger);
    if (shouldShow(values.immediateResponse)) lines.push("", "## Immediate Response", values.immediateResponse);
    if (shouldShow(values.reassessmentTrigger)) lines.push("", "## Reassessment Trigger", values.reassessmentTrigger);
    if (shouldShow(values.triggerReassessment)) lines.push("", "## Trigger Reassessment", values.triggerReassessment);
    if (shouldShow(values.recommendationNote)) lines.push("", "## Operator Note", values.recommendationNote);

    lines.push(
      "",
      "## Reflection Questions",
      "- Does confidence exceed what the evidence can currently justify?",
      "- Are assumptions being treated as facts?",
      "- Who owns the consequences if the claim is wrong?",
      "- What would change your mind about this claim?",
      "- Is the next step too large for the current level of evidence?"
    );

    return lines.join("\n");
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
      wide ? " report-card-wide" : "",
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
    const sections = [
      reportSection("Claim", values.claim, true),
      reportSection("Context", values.context, false),
      reportSection("Posture", values.posture, false),
      reportSection("Decision Required Now", values.decisionNow, false),
      reportSection("Confidence", values.confidence, false),
      reportSection("Recovery Difficulty", values.correctability, false),
      reportSection("Evidence", values.evidence, true),
      reportSection("Assumptions", values.assumptions, true),
      reportSection("Owner", values.owner, false),
      reportSection("What Would Change Your Mind", values.mindChange, true),
      reportSection("Generated Recommendation", values.recommendation.title + "\n\n" + values.recommendation.body, true),
    ];

    if (shouldShow(values.whatChanged)) sections.push(reportSection("What Changed", values.whatChanged, true));
    if (shouldShow(values.monitoringSignal)) sections.push(reportSection("Monitoring Signal", values.monitoringSignal, true));
    if (shouldShow(values.threshold)) sections.push(reportSection("Threshold", values.threshold, false));
    if (shouldShow(values.triggerClaim)) sections.push(reportSection("Trigger Claim", values.triggerClaim, false));
    if (shouldShow(values.actionTrigger)) sections.push(reportSection("Immediate Action Trigger", values.actionTrigger, false));
    if (shouldShow(values.immediateResponse)) sections.push(reportSection("Immediate Response", values.immediateResponse, false));
    if (shouldShow(values.reassessmentTrigger)) sections.push(reportSection("Reassessment Trigger", values.reassessmentTrigger, false));
    if (shouldShow(values.triggerReassessment)) sections.push(reportSection("Trigger Reassessment", values.triggerReassessment, false));
    if (shouldShow(values.recommendationNote)) sections.push(reportSection("Operator Note", values.recommendationNote, true));

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
      '<p class="report-copy">A local summary of the claim, current justification, and recommended next move.</p>',
      '<div class="report-grid">',
      sections.join(""),
      '<section class="report-card report-card-wide"><h3>Reflection Questions</h3><ul class="report-list">',
      [
        "Does confidence exceed what the evidence can currently justify?",
        "Are assumptions being treated as facts?",
        "Who owns the consequences if the claim is wrong?",
        "What would change your mind about this claim?",
        "Is the next step too large for the current level of evidence?",
      ].map(function (item) {
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

  if (copyButton) copyButton.addEventListener("click", copyMarkdown);
  if (downloadButton) downloadButton.addEventListener("click", downloadHtmlReport);
  if (printButton) {
    printButton.addEventListener("click", function () {
      if (!summary.hidden) window.print();
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
    fields.confidence.textContent = values.confidence;
    fields.correctability.textContent = values.correctability;
    fields.whatChanged.textContent = values.whatChanged;
    fields.changedCard.hidden = !shouldShow(values.whatChanged);
    fields.evidence.textContent = values.evidence;
    fields.assumptions.textContent = values.assumptions;
    fields.owner.textContent = values.owner;
    fields.mindChange.textContent = values.mindChange;
    fields.monitoringSignal.textContent = values.monitoringSignal;
    fields.monitoringSignalCard.hidden = !shouldShow(values.monitoringSignal);
    fields.threshold.textContent = values.threshold;
    fields.thresholdCard.hidden = !shouldShow(values.threshold);
    fields.triggerClaim.textContent = values.triggerClaim;
    fields.triggerClaimCard.hidden = !shouldShow(values.triggerClaim);
    fields.actionTrigger.textContent = values.actionTrigger;
    fields.actionTriggerCard.hidden = !shouldShow(values.actionTrigger);
    fields.immediateResponse.textContent = values.immediateResponse;
    fields.immediateResponseCard.hidden = !shouldShow(values.immediateResponse);
    fields.reassessmentTrigger.textContent = values.reassessmentTrigger;
    fields.reassessmentTriggerCard.hidden = !shouldShow(values.reassessmentTrigger);
    fields.triggerReassessment.textContent = values.triggerReassessment;
    fields.triggerReassessmentCard.hidden = !shouldShow(values.triggerReassessment);
    fields.recommendation.textContent = values.recommendation.title + " " + values.recommendation.body;
    fields.note.textContent = values.recommendationNote;
    fields.noteCard.hidden = !shouldShow(values.recommendationNote);

    currentMarkdown = buildMarkdown(values);
    currentHtmlReport = buildHtmlReport(values);
    fields.markdown.textContent = currentMarkdown;

    summary.hidden = false;
    setCopyStatus("");
    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
