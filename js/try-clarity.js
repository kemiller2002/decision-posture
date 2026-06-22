(function () {
  const form = document.getElementById("try-clarity-form");
  const summary = document.getElementById("clarity-summary");

  if (!form || !summary) return;

  const fields = {
    claim: document.getElementById("summary-claim"),
    evidence: document.getElementById("summary-evidence"),
    assumptions: document.getElementById("summary-assumptions"),
    confidence: document.getElementById("summary-confidence"),
    trigger: document.getElementById("summary-trigger"),
  };

  function readValue(formData, key) {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() ? value.trim() : "Not provided.";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);

    fields.claim.textContent = readValue(formData, "claim");
    fields.evidence.textContent = readValue(formData, "evidence");
    fields.assumptions.textContent = readValue(formData, "assumptions");
    fields.confidence.textContent = readValue(formData, "confidence");
    fields.trigger.textContent = readValue(formData, "mind_change");

    summary.hidden = false;
    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
