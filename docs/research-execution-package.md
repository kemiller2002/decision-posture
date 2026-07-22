# Clarity Framework Research Execution Package

**Date:** 2026-07-22
**Purpose:** Consolidate the current Clarity corpus, identify drift and conflict, and define a canonical model for future work.

## Executive Summary

Clarity is trying to help people and organizations maintain justified understanding as reality changes, then commit safely under uncertainty. The framework began as a decision-posture system centered on naming decisions, matching rigor to impact and reversibility, and preserving ownership. It has since evolved into a broader learning-and-reassessment framework centered on claims, evidence, assumptions, confidence, ownership, monitoring, triggers, and adaptation.

The corpus does not support treating Clarity as only a decision framework anymore. The strongest current model is:

- Clarity governs reasoning calibration and reassessment.
- Decision posture is one applied module inside Clarity.
- EDF governs diagnosis.
- Execution governs implementation.
- HelixNote is an optional evidence-preservation and instrumentation layer.

The biggest source of drift is that the repository contains at least two live versions at once:

1. An older training-facing version built around `decision posture`, `belief -> confidence -> commitment -> trigger -> reversibility`, and irreversible-decision language.
2. A newer framework-core version built around `claims`, `assumptions`, `correctability`, `progressive commitment`, `trigger claims`, `reconsideration`, concept maturity, and the idea that Clarity is a learning system.

The canonical model should follow the newer framework-core version while preserving decision posture as the primary applied entry point for training and adoption.

## Corpus Reviewed

Primary framework sources reviewed:

- `README.md`
- `decision-constitution.md`
- `decision-posture-model.md`
- `decision-map.md`
- `decision-architecture.md`
- `decison-loop.md`
- `decision-record.md`
- `docs/foundation/clarity-constitution.md`
- `docs/framework/concept-layers.md`
- `docs/assessor-guide.md`
- `docs/starter-kit.md`
- `docs/progressive-commitment.md`
- `docs/reconsideration-criteria.md`
- `docs/templates/clarity-result-template.md`
- `docs/framework-interactions.md`
- `docs/framework-evolution/*`
- `docs/discovery-log.md`
- `docs/concepts/concept-maturity.md`
- `docs/regression-suite/cases/helixnote.md`
- `docs/regression-suite/cases/edf-delivery-pattern.md`

Training and implementation-facing sources reviewed:

- `training/participant-packet.md`
- `training/participant-packet-2-day.md`
- `training/decision-template.html`
- `training/decision-packet.md`
- `training/facilitator-guide.md`
- `training/adoption-path.html`
- `training/roadmap.html`

Additional historical and governance signals reviewed:

- `rules.md`
- `future-reseafch-questions.md`
- `docs/deferred-insights.md`
- `book/chapters/c13_from_insight_to_system.md`
- `book/chapters/c14_the_clarity_constitution.md`
- `book/chapters/c15_a_transferable_skill.md`

## What The Framework Is Trying To Accomplish

### Core aim

Clarity is trying to make current reasoning explicit enough that people can:

- decide what is justified now
- commit at the right level
- detect when that commitment should change
- adapt sooner and more cheaply when reality changes

### Operational aim

In decision contexts, Clarity tries to prevent common failure modes:

- unnamed decisions
- certainty inflation
- evidence theater
- ownership drift
- trigger drift
- endless experimentation
- irreversible commitment without proportional justification

### Meta aim

At the framework level, Clarity is trying to become self-governing:

- concepts are treated as claims
- concepts have maturity states
- new ideas require regression gain
- the framework itself is expected to be reassessed

## Framework Evolution And Drift

### Phase 1: Decision posture foundation

The earliest stable spine in the repo is a decision discipline:

- a decision is a commitment that constrains future options
- decision posture is selected based on impact and reversibility/correctability
- the framework exists to improve decision quality under uncertainty

This model dominates:

- `decision-posture-model.md`
- `decision-map.md`
- `decision-architecture.md`
- `decison-loop.md`
- much of the training material

### Phase 2: Evidence and trigger discipline

The framework then expands beyond posture alone:

- evidence admissibility becomes explicit
- triggers are separated into signal, threshold, claim, response, reassessment
- failure detection and architecture become first-class

This is visible in:

- `decision-constitution.md`
- `decision-record.md`
- `training/decision-template.html`
- `docs/framework-evolution/0004-trigger-model-revision.md`
- `docs/framework-evolution/0005-operational-response-separation.md`

### Phase 3: Learning-system reframing

The strongest conceptual shift is the move from "decision framework" to "learning system":

- Clarity is no longer mainly about making decisions
- decisions become one application of a broader adaptation system
- claims, assumptions, confidence, monitoring, and reassessment become the true core

This shift is explicit in:

- `README.md`
- `docs/framework-evolution/0001-learning-system.md`
- `docs/framework-interactions.md`
- `docs/progressive-commitment.md`
- `docs/foundation/clarity-constitution.md`

### Phase 4: Governance and output specialization

The framework later adds:

- concept maturity
- regression testing
- discovery logging
- Clarity Result as a distinct report form

This is visible in:

- `docs/framework-evolution/0006-regression-testing.md`
- `docs/framework-evolution/0007-concept-maturity.md`
- `docs/framework-evolution/0008-clarity-results.md`
- `docs/discovery-log.md`

### Main drift patterns

1. **Decision framework -> learning system**
   Earlier materials emphasize decision quality; later materials emphasize adaptation and justified understanding.

2. **Reversibility -> correctability**
   Training and talks still rely heavily on reversibility language, while the framework-core docs explicitly promote correctability as the better calibration concept.

3. **Project/decision posture -> claim-level assessment**
   Older material treats the decision as the primary unit. Later material increasingly treats claims and current justification as the primary unit.

4. **Simple trigger language -> trigger chain**
   Older material says "trigger" in a generic sense. Newer material decomposes trigger design into monitoring signal, threshold, trigger claim, response, and trigger reassessment.

5. **Single artifact mindset -> output family**
   Older work centers on workshop packet and decision template artifacts. Later work distinguishes quick assessments, full assessments, decision records, and Clarity Results.

## Assumptions Inventory

### Assumptions with meaningful support inside the corpus

These are supported by repeated appearance across the framework docs plus repeated reference to regression cases. This is internal support, not external validation.

| Assumption | Support inside corpus | Status |
|---|---|---|
| Organizations often fail because reasoning remains implicit until reality forces correction. | Repeated in constitution, training, workshop stories, and evolution docs. | Supported internally |
| Matching rigor to consequence and recoverability improves decision quality. | Strongly reinforced through decision posture docs and correctability/proportional-certainty evolution notes. | Supported internally |
| Reversibility alone is too narrow; correctability is a better calibration concept. | Explicitly documented as a promoted revision with repeated case references. | Supported internally |
| Explicit ownership reduces drift and accountability failure. | Repeated in constitution, decision architecture, loop, and training artifacts. | Supported internally |
| Triggers and thresholds are themselves claims and should be reassessed. | Explicit in trigger model revision and facilitator materials. | Supported internally |
| Starting with the minimum justified complexity and escalating only when evidence requires it is useful across domains. | Supported by progressive commitment docs and EDF relationship docs. | Supported internally |
| The framework itself should evolve through regression-tested reassessment. | Supported by evolution governance docs and concept maturity docs. | Supported internally |

### Assumptions with only partial support

| Assumption | Why partial | Status |
|---|---|---|
| Clarity works equally well across all domains. | The repo cites cross-domain cases, but mostly as internal examples, not external evaluations. | Partially supported |
| External users will understand learning-system framing better than decision-framework framing. | Explicitly listed as an open question. | Partially supported |
| Clarity Results are more useful than older assessment reports. | Candidate only; feedback loop not yet evidenced. | Partially supported |
| Claim-level posture is better than project-level posture. | Raised as an open research question; not settled. | Partially supported |

### Assumptions not validated in the corpus

These are active claims or design bets without validation evidence in the repository.

| Assumption | Why unvalidated | Status |
|---|---|---|
| The framework has been externally validated by real users beyond internal or author-led use. | No external study, user test summary, or measured outcomes found. | Unvalidated |
| Trigger quality can be assessed consistently across domains. | Still open/research. | Unvalidated |
| Signal quality should become a stable concept. | Still research. | Unvalidated |
| Modes of success should become a stable concept. | Still research. | Unvalidated |
| A formal evidence scoring system is necessary or useful. | Mentioned as an open question; no canonical scoring model exists. | Unvalidated |
| Clarity should ultimately replace decision-posture language as the dominant external teaching frame. | Open in learning-system note and contradicted by current training assets. | Unvalidated |

## Which Assumptions Have Supporting Evidence

The repository mostly uses three kinds of evidence:

1. **Repeated conceptual recurrence**
   A concept appears across multiple independent documents and remains stable through revisions.

2. **Regression-case reuse**
   A concept is repeatedly cited as explanatory in Apollo 11, Challenger, Chernobyl, HelixNote, EDF delivery pattern, Rik methodology, and related cases.

3. **Applied artifact recurrence**
   The same operating need appears in assessments, templates, training, and facilitation assets.

Strongest internally evidenced concepts:

- claim
- evidence
- assumption
- confidence
- ownership
- reassessment
- correctability
- proportional certainty
- progressive commitment

Moderately evidenced but still evolving:

- trigger claim
- Clarity Results
- operational response separation
- learning-system framing

Weakly evidenced or still exploratory:

- trigger drift
- signal quality
- modes of success
- calibration as umbrella concept

## Complete Conceptual Model

### Canonical stack

#### 1. Purpose layer

Clarity exists to maintain justified understanding under changing reality so that commitments can be made safely and revised sooner when wrong.

#### 2. Mechanism layer

The mechanism is reassessment:

- state the current understanding
- state what justifies it
- state what would change it
- monitor for those conditions
- adapt when they occur

#### 3. Core element layer

- Claim
- Evidence
- Assumption
- Confidence
- Ownership
- Monitoring Signal
- Threshold
- Trigger
- Trigger Claim
- Reassessment

#### 4. Calibration layer

- Correctability
- Proportional Certainty
- Assessment Effort
- Appropriate Investment
- Progressive Commitment

#### 5. Applied decision layer

- Define the decision
- Determine posture
- Evaluate admissible evidence
- assign owner
- commit with constraints
- monitor outcomes
- learn and reassess

#### 6. Governance layer

- concept maturity
- regression testing
- documented evolution
- discovery logging
- constitutional rules for framework change

### Canonical unit of analysis

The most defensible unit of analysis is:

- `claim` for framework-core reasoning
- `decision` for applied commitment work

This resolves an important conflict in the repo. Clarity should not force all work into decision framing too early, but it should require explicit decisions when commitment is actually being made.

### Canonical mental model

The user mental model Clarity should teach is:

1. I do not need certainty first.
2. I need to know what is currently justified.
3. I need to name the commitment, if any.
4. I need to match commitment to consequence and correctability.
5. I need explicit triggers for reconsideration.
6. I need an owner for the current belief or decision.
7. I should increase complexity only when evidence requires it.

## Framework Architecture

### Architecture overview

```text
Framework Engineering
    -> governs framework creation/evolution

Clarity
    -> governs reasoning calibration, commitment, monitoring, and reassessment

Applied Modules inside Clarity
    -> Decision Posture
    -> Assessments
    -> Clarity Results
    -> Decision Architecture / Decision Record

Adjacent Frameworks
    -> EDF diagnoses what is happening
    -> Execution implements what was chosen

Instrumentation Layer
    -> HelixNote preserves evidence, state, and decision artifacts
```

### Relationship to HelixNote

HelixNote is not the framework. In the current corpus it plays three roles:

- evidence preservation
- decision artifact capture
- a live product/regression case used to test concept portability

The roadmap clarifies that HelixNote should remain optional and credible, not fused into Clarity as a required product dependency.

### Relationship to EDF

EDF is not replaced by Clarity. The clean boundary is:

- Clarity decides how much diagnostic depth is justified now
- EDF performs the diagnostic work
- Clarity defines escalation/de-escalation criteria around EDF mode selection

## Core Concepts

### Canonical core

- Claim
- Evidence
- Assumption
- Confidence
- Ownership
- Reassessment
- Correctability
- Proportional Certainty
- Monitoring Signal
- Threshold
- Trigger
- Trigger Claim
- Progressive Commitment

### Applied concepts

- Decision
- Decision posture
- Decision owner
- Decision architecture
- Failure signals
- Constraints / guardrails
- Admissibility
- Clarity Result

### Governance concepts

- concept maturity
- regression suite
- discovery log
- framework constitution

## Decision Flow

### Canonical decision flow

1. Recognize a signal or situation.
2. State the current claim or understanding.
3. Determine whether a decision is actually required now.
4. If yes, define the decision as a commitment.
5. Assess impact and correctability.
6. Select posture or commitment level proportional to consequence.
7. Evaluate admissible evidence and active assumptions.
8. Assign a single owner.
9. Define monitoring signals, thresholds, trigger claims, and reassessment conditions.
10. Commit with constraints matched to uncertainty.
11. Observe outcomes.
12. Reassess the claim, the trigger design, and the commitment when conditions change.

### Canonical posture logic

- `Fast`: low impact, high correctability
- `Experimental`: uncertainty high, blast radius constrained, learning goal explicit
- `Guardrail`: meaningful impact or operational boundary requires protection
- `Strategic`: high impact, low correctability, strong ownership and evidence required

## User Workflow

### Existing practical workflow in the repo

The most concrete real workflow appears across `docs/starter-kit.md`, `docs/assessor-guide.md`, `training/decision-template.html`, and the workshop packet:

1. Name the decision or claim.
2. Surface assumptions and constraints.
3. Separate evidence from narrative.
4. Choose an appropriately constrained commitment.
5. Assign ownership.
6. Define triggers and review points.
7. Execute.
8. Revisit when the defined conditions occur.

### Canonical future workflow

#### For lightweight use

- Level 0 mental check
- Level 1 quick assessment
- one claim or decision
- one owner
- one trigger for reconsideration

#### For full use

- full assessment or decision record
- explicit posture
- admissibility review
- trigger chain
- monitoring and reassessment plan
- outcome review / Clarity Result

### User journey

The training and adoption materials imply this journey:

1. **Language phase**
   Users learn to stop asking for "more data" by default and instead name the decision, assumption, owner, and trigger.

2. **Posture normalization phase**
   Users begin using constraints, staged commitment, and trigger-based reassessment in real work.

3. **Expectation inversion phase**
   Users start to see unjustified certainty, not uncertainty, as the risky behavior.

## Required Information

### Minimum required for canonical Clarity use

- Current claim or decision
- Current justification
- Active assumptions
- Consequence if wrong
- Correctability if wrong
- Single owner
- What is being monitored
- What threshold matters
- What would trigger reconsideration

### Required for full decision commitment

- Explicit commitment statement
- posture selection
- admissible evidence review
- constraints or guardrails
- response plan
- trigger reassessment condition

## Optional Information

These appear useful but should not be required in every use:

- formal confidence labels
- evidence categorization schemes
- GO conditions
- executive summary / snapshot layer
- report polish
- detailed scoring
- multi-claim decomposition
- explicit maturity tags for every concept used

## Existing Try Clarity Implementation

No artifact literally named "Try Clarity" was found. The closest existing implementation is an inferred bundle made of:

- `docs/starter-kit.md`
- `docs/assessor-guide.md`
- `docs/reconsideration-criteria.md`
- `training/decision-template.html`
- `training/participant-packet.md`

Taken together, these function as the current "try it now" pathway:

- quick assessment
- full assessment
- one-page decision template
- workshop packet
- facilitator-led transfer into real work

This implementation is useful but not conceptually clean. It mixes old and new framework language.

## Outputs And Reports

### Outputs currently present

- Quick Assessment
- Full Assessment
- Decision Record
- Decision Template
- Participant Packet / Decision Packet
- Clarity Result
- training and facilitation artifacts

### Canonical output hierarchy

1. `Quick Assessment`
   For small but non-trivial claims.

2. `Full Assessment`
   For explicit ownership, consequence, or monitoring.

3. `Decision Record`
   For live commitment decisions.

4. `Clarity Result`
   For reporting current understanding, uncertainty, monitoring, and next posture after or during assessment.

### Scoring status

Operational scoring is not canonical today.

What exists:

- regression scoring (`Strong Gain`, `Moderate Gain`, `No Gain`, `Confusing`, `Negative`)
- concept maturity (`Research`, `Candidate`, `Core`, `Deprecated`)
- some legacy workshop rating prompts

What does not exist:

- a settled evidence score
- a settled confidence score
- a canonical numeric framework score

Canonical guidance:

- keep scoring out of the core operating model for now
- retain regression scoring for framework evolution only

## Opportunities For Simplification

1. Collapse duplicate constitutions.
   The repo has `rules.md`, `decision-constitution.md`, and `docs/foundation/clarity-constitution.md`, which overlap but do not align perfectly.

2. Standardize on `correctability`.
   Keep `reversibility` only as a teaching shortcut or subcomponent of correctability.

3. Separate `claim-level Clarity` from `decision-posture training`.
   The framework is cleaner when the broader reasoning model and the applied decision module are explicitly separated.

4. Reduce trigger terminology drift.
   Canonical docs should always use:
   `monitoring signal -> threshold -> trigger -> trigger claim -> response -> trigger reassessment`

5. Define one official starter path.
   The repo currently has multiple starter paths spread across assessment docs and training assets.

6. Keep HelixNote optional.
   The roadmap already points in the right direction; future docs should not imply product dependency.

## Missing Concepts Or Missing Explicit Decisions

1. A canonical top-level diagram that shows:
   `Clarity core`, `Decision Posture module`, `EDF`, `Execution`, and `HelixNote`.

2. A formal statement resolving the primary unit conflict:
   `claim` versus `decision`.

3. A canonical "minimum viable Clarity" artifact for first-time users.

4. A clean external explanation of when to use:
   Quick Assessment, Full Assessment, Decision Record, and Clarity Result.

5. A documented external validation plan.
   The repo has internal evidence logic, but not an explicit plan for measuring adoption quality or outcome improvement.

6. A canonical position on posture taxonomies beyond the decision matrix.
   `discovery / commitment / reassessment` appears in research docs, but the operational training still teaches the four-quadrant decision posture model.

## Internal Inconsistencies

### Major inconsistencies

1. **What Clarity is**
   Some docs say Clarity is a decision framework.
   Newer docs say decision-making is only one application.

2. **Primary unit**
   Some docs center the decision.
   Newer docs center the claim/current understanding.

3. **Calibration concept**
   Some docs and training assets center reversibility.
   Newer docs explicitly replace that emphasis with correctability.

4. **Trigger model**
   Some docs use trigger as a simple condition.
   Newer docs treat trigger design as a full claim chain.

5. **Output model**
   Some artifacts are teaching packets, some are live-decision artifacts, and some are intended as reports, but the repo does not clearly separate them.

### Smaller inconsistencies

1. File naming and spelling drift, including `decison-loop.md`.
2. Multiple constitutions with different emphasis and different enforcement language.
3. Different audiences mixed together in one repo: framework maintainer, facilitator, trainee, live assessor, and future product designer.

## Conflicting Versions Across Conversations And Artifact Families

The repo strongly suggests that different conversations evolved conflicting versions, even where the raw conversations are only indirectly represented.

### Version A: Decision Posture Training Version

Visible in:

- `training/participant-packet.md`
- `training/facilitator-guide.md`
- `training/decision-template.html`
- `training/clarity-workshop-deck.html`
- related talks and pitch materials

Characteristics:

- high-stakes decisions under uncertainty
- belief/confidence/commitment/trigger/reversibility
- emphasis on irreversible harm
- workshop-centered
- action-first, language-reset framing

### Version B: Learning System / Assessment Version

Visible in:

- `README.md`
- `docs/progressive-commitment.md`
- `docs/assessor-guide.md`
- `docs/framework-interactions.md`
- `docs/framework-evolution/*`
- `docs/foundation/clarity-constitution.md`

Characteristics:

- claims and current justification
- reassessment as the core contribution
- progressive commitment
- concept governance
- cross-framework orchestration

### Version C: Maintainer / Lint Constitution Version

Visible in:

- `rules.md`

Characteristics:

- mechanism-first note discipline
- anti-performative writing constraints
- future-maintainer governance
- stronger rhetoric than the rest of the repo

### Conclusion on conflict

These versions are not irreconcilable, but they are currently insufficiently separated. The main conflict is not substance. It is layer confusion:

- training layer
- framework-core layer
- maintainer/governance layer

## Canonical Model For Future Work

### Canonical statement

Clarity is a framework for making current reasoning explicit enough to justify present commitment, define what would change that commitment, and adapt sooner when reality changes.

### Canonical boundaries

- Clarity governs reasoning calibration, commitment, monitoring, and reassessment.
- Decision Posture is the main applied decision module within Clarity.
- EDF governs diagnosis.
- Execution governs implementation.
- HelixNote is an optional evidence-preservation and instrumentation layer.

### Canonical core terms

Use these terms in future work:

- claim
- evidence
- assumption
- confidence
- ownership
- correctability
- proportional certainty
- monitoring signal
- threshold
- trigger
- trigger claim
- reassessment
- progressive commitment

### Canonical teaching sequence

1. What do we currently think is true?
2. What currently justifies that?
3. Is a decision required now?
4. If yes, what is the decision?
5. How bad is it if we are wrong?
6. How correctable is it if we are wrong?
7. What evidence is admissible?
8. Who owns the claim or decision?
9. What signal, threshold, and trigger claim would make us reconsider?
10. What is the minimum justified commitment now?

### Canonical product/application sequence

1. Starter Kit for first use
2. Quick Assessment / Full Assessment for reasoning work
3. Decision Record for live commitments
4. Clarity Result for operational reporting
5. Regression and evolution process for framework changes

### Canonical simplification rule

If a concept does not improve explanatory power across regression cases, keep it out of the core model.

## Recommended Next Actions

1. Declare the canonical layer model in `README.md`.
2. Choose one constitution as canonical and demote the others to historical or audience-specific variants.
3. Refactor training assets to say `correctability` first and `reversibility` second.
4. Publish a single official starter flow:
   `Quick Assessment -> Full Assessment -> Decision Record -> Clarity Result`.
5. Add a one-page canonical diagram for Clarity, Decision Posture, EDF, Execution, and HelixNote.
6. Mark unresolved research items clearly so they stop leaking into training as if settled.

## Bottom Line

The most defensible canonical reading is:

Clarity is not just a decision framework. It is a reassessment and adaptation framework whose decision-posture module helps organizations commit safely under uncertainty. The future version should preserve the training simplicity of decision posture while grounding all framework-core work in claims, correctability, progressive commitment, and explicit reconsideration.
