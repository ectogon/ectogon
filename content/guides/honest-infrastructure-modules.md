---
title: "Build Infrastructure Modules With Escape Hatches"
slug: "honest-infrastructure-modules"
description: "A good module removes incidental complexity while keeping lifecycle, cost, security, and provider behavior visible."
card_summary: "Standardize the common path without hiding the platform."
guide_number: "08"
topic: "Infrastructure as code"
date: 2026-08-23T00:00:00-04:00
weight: 8
draft: false
brief:
  - "Standardize a real repeated pattern."
  - "Expose decisions, not every provider field."
  - "Return useful resource identities."
  - "Support exceptional needs without forks."
---

## Abstract after the pattern is understood

Modules are most valuable when several consumers share the same lifecycle and policy. Building the abstraction before that pattern is understood often produces a thin wrapper with dozens of pass-through variables—or a rigid opinion that fits only the first consumer.

Start with concrete deployments. Identify which resources always change together, which defaults are genuinely safe, and which differences reflect meaningful choices. The module boundary should follow ownership and lifecycle, not merely resource type.

## Design a small decision-oriented interface

Inputs should express user intent: availability level, retention requirement, network exposure, capacity class, or backup policy. Avoid mirroring every provider argument. A pass-through interface inherits all provider complexity while adding another layer to debug.

Defaults must be safe, documented, and unsurprising. If an option can materially change cost, durability, exposure, or replacement behavior, make it explicit. Validate incompatible combinations early and write error messages that explain how to fix them.

{{< callout label="Honest abstraction" >}}
Hide repetitive syntax, not operational consequences. Consumers should still understand what gets created, replaced, exposed, and billed.
{{< /callout >}}

## Provide controlled escape hatches

No shared module can predict every future requirement. Offer bounded extension points for tags, policy fragments, additional rules, or supported provider options. Prefer typed maps and documented merge behavior over an unstructured bag of arbitrary settings.

When an escape hatch becomes common, promote it into the main interface. When a consumer needs to replace half the module's behavior, allow a clean opt-out rather than forcing a permanent fork. A module should make the common case easy without making the uncommon case impossible.

## Treat modules as products

Version modules and communicate breaking changes. Test example configurations, validation failures, upgrade paths, and destructive plans. Use realistic fixtures that exercise optional branches, not only the smallest happy path.

Outputs are part of the contract. Return stable identities and connection information that downstream consumers need, but avoid leaking the entire underlying resource object. Excessive outputs couple callers to internal implementation and make refactoring harder.

Before release, inspect plans for representative consumers. A syntactically compatible change can still cause replacement, permission expansion, network exposure, or cost growth.

{{< checklist >}}
The module represents a repeated lifecycle and ownership boundary.
Inputs describe decisions instead of duplicating provider syntax.
Costly or destructive choices are explicit.
Extension points are bounded and have clear merge rules.
Outputs are stable and intentionally limited.
Tests cover upgrades, failures, and representative plans.
{{< /checklist >}}
