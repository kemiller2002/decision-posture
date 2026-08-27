# Clarity explanation audit

Date: 2026-08-26

## Current behavior

Clarity's current public core is a lightweight claim review. The interactive path takes three to five minutes and asks for one claim, what currently supports it, assumptions, confidence, correctability, an owner, and what would change the user's mind. Detailed monitoring and trigger design are optional in the interactive flow. The framework promises to make the posture behind action visible and revisable, not to select the correct action or predict outcomes.

The main framework definition already treats evidence as broader than quantitative data: direct observation, data, tests, history, or constrained experience. The site also repeatedly says that Clarity operates under uncertainty, that data is not an answer, and that its goal is not perfect decisions. Quantitative evidence is therefore not a stated requirement in the current core.

Assumptions are consistently separated from support for a claim. Confidence is meant to describe how strongly the current support justifies the claim. Correctability and reassessment keep action proportional and revisable. The deeper Decision Constitution, Decision Map, and full assessment add a more formal operating model for situations that warrant it.

## Findings and smallest corrections

| Issue | Classification | Reasonable misunderstanding | Smallest effective correction |
| --- | --- | --- | --- |
| The core definition names several evidence types but does not plainly say that qualitative reports, professional judgment, and an honest absence of evidence are valid inputs to the assessment. | Explanation problem | Evidence may still sound like information that has been formally collected or measured. | Add one concise explanation: use the best relevant information reasonably available; label judgment as judgment; write "none yet" when appropriate. |
| The quick assessment requires text in the evidence field without telling the user that limited or absent evidence is an acceptable answer. | Explanation problem | A user may believe they cannot complete Clarity until evidence has been obtained. | Keep the field, but add short helper text permitting "limited" or "none yet" and distinguishing support from assumption or preference. |
| Low-confidence recommendations generally say to gather evidence or reduce scope and do not acknowledge situations where the cost of waiting outweighs unresolved uncertainty. | Framework-language problem | The generated recommendation can behave like an evidence gate even when a decision is time-bound and uncertainty cannot be removed. | Reword recommendations to allow a proportionate decision with uncertainty and the cost of delay visible; do not add a field, score, or gate. |
| The worked examples and trigger examples lean heavily toward feature adoption, deployments, error counts, cost, tests, and other measurable signals. | Example problem | Users learn implicitly that Clarity is best suited to technical or quantitatively measurable decisions. | Preserve quantitative examples and add one compact strategy/organizational example based on observations, stakeholder reports, constraints, experience, and explicit uncertainty. |
| The Learn page says additional validation is required before commitment in its only full worked example. | Training problem | The lesson can be read as universal: insufficient evidence blocks commitment. | Make the conclusion conditional on the size and timing of the commitment, then show a legitimate decision made with incomplete information. |
| The glossary definition "what currently supports a claim" is too terse to prevent opinions from being relabeled as evidence. | Explanation problem | Broadening evidence elsewhere could become permissive or vague. | Clarify that evidence is relevant information or observation that provides a reason to believe a claim; judgment remains judgment and assumptions remain assumptions. |
| The downloadable quick template presents monitoring, thresholds, trigger claims, two trigger types, and trigger reassessment at the same level as the lightweight core, despite the interactive version marking them advanced and optional. | Explanation/framework problem | The template makes the normal workflow appear to require a ten-step trigger-design process. | Separate the core quick assessment from an explicitly optional advanced section; do not add any fields. |
| The Decision Constitution uses universal mandates ("every decision," five required checks, predefined triggers before experimentation), formal evidence admission states, and the promise that Clarity makes decisions "safe despite uncertainty." | Framework problem in the legacy/deep guide | The guide both overpromises safety and turns proportional discipline into mandatory governance. | Scope formal controls to decisions whose consequences justify them, describe evidence checks as lightweight by default, and replace the safety promise with visible, owned uncertainty. |
| The Decision Map says strategic decisions have "strong evidence requirements" and optimize for "correctness." | Framework-language problem | Consequence may be mistaken for a requirement to prove a future outcome, even where decisive evidence is unavailable. | Use "stronger justification" and "risk-aware commitment"; state that higher consequence increases care, not certainty or automatic process weight. |
| The site distinguishes decision posture from eventual outcomes only indirectly. | Training problem | A user may evaluate the framework by whether a decision later succeeded, rewarding luck and punishing reasonable uncertainty. | Add one short teaching note that decision quality depends on the reasoning available at the time, not the eventual outcome alone. |
| The current core uses confidence, assumptions, correctability, and optional reassessment to keep uncertainty visible. | No problem | These concepts already support decisions under uncertainty without requiring confidence calculations. | Preserve the low/moderate/high choice and do not add scoring, calculations, matrices, or research requirements. |

## Deliberate non-changes

- No evidence matrix, source scoring, confidence calculation, research checklist, competing-hypothesis exercise, approval gate, or new form field.
- No removal of quantitative or technical examples; they are useful where measurement exists.
- No attempt to make opinions count as evidence. Experience and expert judgment may justify belief, but must be named honestly and remain distinguishable from observed facts.
- No rule that a major decision automatically requires a large process. Impact and correctability affect the strength of justification and care appropriate to the situation, not a mandatory ceremony.
- No attempt to defend Clarity against deliberate manipulation, cherry-picking, or bad-faith use.
- No promise that Clarity makes a decision correct or safe. It improves the visibility, proportionality, ownership, and revisability of the reasoning.

## Implementation standard

The correction should leave the normal interactive assessment at the same number of fields and the same advertised three-to-five-minute duration. Complexity remains available in the optional advanced trigger section and full assessment, not mandatory in the core.
