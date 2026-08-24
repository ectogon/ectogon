---
title: "Put Configuration Where It Belongs"
slug: "configuration-ownership"
description: "Configuration becomes expensive when ownership is ambiguous. Put each value in the repository and layer that can explain why it exists."
card_summary: "Keep defaults near the workload and environment deltas at the edge."
guide_number: "01"
topic: "Configuration"
date: 2026-08-23T00:00:00-04:00
weight: 1
draft: false
brief:
  - "Defaults belong with the workload."
  - "Policy belongs with the platform."
  - "Environment files should contain differences, not copies."
  - "Every override needs an owner and a reason."
---

## Configuration is an ownership map

A value is never just a value. A replica count expresses a capacity assumption. A timeout encodes an expectation about a dependency. A feature flag records a product decision. Where that value lives tells future maintainers who is expected to understand it.

Problems begin when the same setting appears in a chart, an environment overlay, a deployment workflow, and an emergency patch. The effective configuration may still be valid, but nobody can confidently identify the authoritative source. That ambiguity slows reviews and makes incidents harder to unwind.

{{< callout label="Working rule" >}}
Place a value at the lowest layer that can own it correctly, and override it only when a higher layer has a genuine reason to differ.
{{< /callout >}}

## Use three clear layers

### 1. Workload defaults

Values that describe normal application behavior should live beside the workload: ports, health-check paths, resource starting points, safe timeouts, and feature defaults. Application owners can review them with the code they affect, and local development remains representative.

### 2. Platform policy

Controls that apply broadly belong in the platform layer. Examples include required labels, admission policies, network boundaries, baseline security contexts, and standard telemetry hooks. A workload should consume these conventions without copying their implementation.

### 3. Environment deltas

Environment configuration should contain only what is truly different: a production scale target, a regional endpoint, or a sandbox integration. If an environment file repeats every default, it becomes a fork that silently drifts.

## Make overrides earn their place

Before adding an override, ask four questions: What forces this environment to differ? Who owns the decision? How will the value be validated? When should the override be removed? Record the answer near the configuration when it is not obvious from the value itself.

Avoid using deployment repositories as a convenient dumping ground for workload behavior. That separates configuration from the people best equipped to test it. Keep platform repositories focused on orchestration and environment selection; keep application behavior with the application whenever practical.

Secrets are the important exception. Commit references, schemas, and required key names—not secret material. The value itself should arrive through a dedicated secret system at runtime.

## Validate the assembled result

Layering is only useful if the final configuration can be inspected before release. Render templates in CI, validate schemas, reject unknown keys, and show reviewers the effective output. Test representative environments rather than assuming a successful template render proves semantic correctness.

Prefer explicit merge rules. Lists, maps, and null values often behave differently across tools; a surprising merge can be more dangerous than a syntax error. When composition becomes difficult to explain, simplify the layers instead of adding another transformation.

{{< checklist >}}
Every default has one authoritative home.
Environment files contain deltas rather than full copies.
Overrides include an owner and a durable reason.
Secret references are committed; secret values are not.
CI renders and validates the effective configuration.
Operators can trace any deployed value back to source.
{{< /checklist >}}
