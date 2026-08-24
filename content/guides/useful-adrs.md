---
title: "Write ADRs People Will Actually Use"
slug: "useful-adrs"
description: "The value of an architecture decision record is not ceremony. It preserves the reasoning that code alone cannot show."
card_summary: "Preserve the decision, forces, tradeoffs, and consequences."
guide_number: "10"
topic: "Decisions"
date: 2026-08-23T00:00:00-04:00
weight: 10
draft: false
brief:
  - "Record material, durable choices."
  - "Explain forces and alternatives."
  - "Name consequences honestly."
  - "Supersede records; do not rewrite history."
---

## Record the decisions code cannot explain

Source code shows what was built. It rarely explains why one design was chosen over another, which constraints mattered at the time, or which tradeoffs were accepted intentionally. Without that context, future maintainers may repeat old investigations or “fix” behavior that encodes a deliberate compromise.

Write an ADR when a choice establishes a convention, selects an interface or dependency, changes a security or operational boundary, accepts meaningful cost or reliability tradeoffs, or deliberately defers important scope. Routine implementation details do not need their own record.

## Keep the structure small

### Context

Describe the problem, current state, constraints, and forces that make a decision necessary. Include only the history needed to understand the choice.

### Decision

State the choice in direct language. Name its scope and the point at which it becomes effective. A reader should not need to infer the conclusion from a long discussion.

### Alternatives

List the viable options that received serious consideration and why they were not selected. Do not create straw alternatives merely to make the chosen design look inevitable.

### Consequences

Record positive, negative, and neutral outcomes. Include new operational work, migration needs, lock-in, failure modes, costs, and follow-up decisions.

{{< callout label="Quality test" >}}
A useful ADR lets a future engineer disagree intelligently because the original constraints and tradeoffs are visible.
{{< /callout >}}

## Write it with the change

Keep ADRs close to the system they describe and review them with the implementation. A record written months later tends to replace real uncertainty with a cleaner story. Capturing the decision while alternatives are still fresh produces better evidence.

Link the record to relevant code, design documents, migrations, or issues, but keep the core reasoning inside the ADR. External conversations disappear and permissions change. The record should remain understandable on its own.

Use a stable identifier and a simple status such as proposed, accepted, superseded, or deprecated. If a later decision changes the outcome, create a new record and link both directions. Do not silently edit the original rationale to match current thinking.

## Avoid documentation theater

An ADR is not a transcript, implementation plan, or universal approval form. Keep it concise enough to review. Separate unknowns from decisions, and assign follow-up actions elsewhere. If the decision is reversible and local, a short record may be sufficient; irreversible cross-system choices deserve more analysis.

Revisit records during major changes and incidents. Mark assumptions that no longer hold. Use the collection as an index of design intent, not a graveyard of untouched prose.

{{< checklist >}}
The choice is material enough to preserve.
Context names the real constraints and forces.
The decision is stated directly and has clear scope.
Viable alternatives are represented fairly.
Negative and operational consequences are explicit.
Later changes supersede rather than rewrite history.
{{< /checklist >}}
