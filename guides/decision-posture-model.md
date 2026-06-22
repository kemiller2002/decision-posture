# Decision Posture Model

The Decision Posture Model is the core model of the **Clarity Framework**.

Decision posture determines **how a decision should be made** before the organization commits to action.

Most organizations move directly from signal to decision. The Clarity Framework inserts an essential step: determining the **decision posture**.

```
Signal → Posture → Decide → Act → Learn
```

---

# The Two Posture Questions

Decision posture is determined by answering two questions.

```
How large is the impact if we are wrong?
How reversible is the decision?
```

These two variables determine the **speed, rigor, and authority** required to make the decision.

---

# Decision Posture Axes

The model uses two axes.

Vertical axis:

```
Impact
```

How significant the consequences are if the decision is wrong.

Horizontal axis:

```
Reversibility
```

How easily the decision can be undone after it is made.

---

# Decision Posture Matrix

```
                    Impact
                      ↑
                      │
            Strategic │ Guardrail
                      │
                      │
          ────────────┼────────────
                      │
          Experimental │ Fast
                      │
                      └────────────→ Reversibility
```

---

# The Four Decision Postures

## Fast

Fast posture is used when decisions are **low impact and easily reversible**.

Characteristics:

- move quickly
- minimal analysis
- local ownership
- learning through action

Examples:

- rolling back a deployment
- adjusting a feature flag
- minor configuration changes

Fast decisions should not be slowed by excessive analysis.

---

## Experimental

Experimental posture is used when decisions are **reversible but uncertain**.

The goal is learning.

Characteristics:

- small experiments
- limited scope
- defined learning goals
- rapid feedback loops

Examples:

- A/B testing
- prototype features
- exploratory architecture work
- telemetry gathering

Experiments should generate information before committing to larger decisions.

---

## Guardrail

Guardrail posture is used when decisions are **high impact but operationally constrained**.

The focus is risk control.

Characteristics:

- safety boundaries
- regulatory requirements
- operational safeguards
- predefined procedures

Examples:

- security controls
- compliance requirements
- safety-critical operations
- financial control policies

Guardrail decisions emphasize prevention and protection.

---

## Strategic

Strategic posture is used when decisions are **high impact and difficult to reverse**.

These decisions require the most rigor.

Characteristics:

- deliberate analysis
- senior ownership
- cross-team coordination
- long-term consequences

Examples:

- major architecture choices
- company strategy decisions
- irreversible infrastructure changes
- mergers or acquisitions

Strategic decisions require careful consideration before commitment.

---

# Relationship to Amazon Type 1 and Type 2 Decisions

Amazon popularized the idea that decisions fall into two categories.

```
Type 1 decisions → difficult to reverse
Type 2 decisions → reversible
```

The Decision Posture Model expands this concept by adding **impact**.

```
Type 2 (reversible)
    → Fast
    → Experimental

Type 1 (irreversible)
    → Guardrail
    → Strategic
```

Reversibility determines **speed**.

Impact determines **rigor**.

---

# Core Principle

Not every decision should be treated the same.

Decision posture ensures the organization chooses the **appropriate decision approach** before acting.

```
Fast decisions move quickly.
Experiments generate learning.
Guardrails control risk.
Strategic decisions require deliberate commitment.
```

The goal is not perfect analysis.

The goal is choosing the **correct decision posture**.

---

# Operational Language

When the model is used in practice, teams should begin discussions by asking:

```
What posture is this decision?
```

This simple question prevents organizations from applying the wrong level of speed or rigor to a decision.

Decision posture creates clarity before commitment.