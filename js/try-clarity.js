(function () {
  const form = document.getElementById("try-clarity-form");
  const summary = document.getElementById("clarity-summary");

  if (!form || !summary) return;

  const fields = {
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
  const downloadButton = document.getElementById("download-markdown");
  const copyStatus = document.getElementById("copy-status");
  const radioInputs = Array.from(form.querySelectorAll('input[type="radio"]'));
  let currentMarkdown = "";
  let copyResetTimer = null;

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
      "# Clarity Quick Assessment",
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

  function downloadMarkdown() {
    if (!currentMarkdown) return;

    const blob = new Blob([currentMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clarity-quick-assessment.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  radioInputs.forEach(function (input) {
    input.addEventListener("change", syncChoiceState);
  });

  if (copyButton) {
    copyButton.addEventListener("click", copyMarkdown);
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", downloadMarkdown);
  }

  syncChoiceState();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const values = {
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
    fields.markdown.textContent = currentMarkdown;

    summary.hidden = false;
    setCopyStatus("");
    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
