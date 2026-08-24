---
title: "Upgrade Dependencies With Evidence"
slug: "evidence-led-upgrades"
description: "An upgrade is a change to behavior and supply-chain trust, not a version-number ritual. Match review depth to real exposure."
card_summary: "Use release context, focused testing, and staged exposure."
guide_number: "09"
topic: "Maintenance"
date: 2026-08-23T00:00:00-04:00
weight: 9
draft: false
brief:
  - "Classify reach and privilege."
  - "Read the actual change."
  - "Test the integration boundary."
  - "Stage exposure and preserve rollback."
---

## Start with consequence, not semver

A patch update to a privileged deployment tool may deserve more scrutiny than a major update to an isolated development formatter. Classify the dependency by where it runs, what data it handles, which permissions it receives, and how easily failure can be detected and reversed.

Consider transitive reach. A library used in a public request path, build pipeline, authentication layer, or infrastructure provider can carry a large blast radius even when the direct code change is small.

## Read beyond the release title

Review release notes, migration guides, changed defaults, deprecations, and known issues. For security-sensitive or poorly documented updates, inspect the source diff and dependency tree. Confirm that the package name, publisher, repository, and release provenance are what you expect.

Look for behavior hidden outside the public API: initialization changes, environment detection, file writes, network access, install scripts, new transitive packages, and altered retry or timeout defaults.

{{< callout label="Risk question" >}}
If this dependency behaved maliciously or simply failed, what authority and data would it have at that moment?
{{< /callout >}}

## Test the boundary you depend on

Generic unit tests may prove little about an integration upgrade. Add or run focused tests at the boundary: render representative configuration, execute a real command in a disposable environment, verify generated artifacts, exercise authentication, or compare plans before and after.

Use the lockfile as evidence. Review changed transitive dependencies and integrity metadata. Avoid mixing unrelated upgrades in one change; a narrow diff is easier to understand and revert.

When compatibility depends on external services, test against supported versions and realistic limits. A mock that always returns the ideal response cannot reveal changed pagination, throttling, or error semantics.

## Control exposure

Roll out first where impact is bounded and telemetry is available. Observe error rates, latency, resource use, output diffs, and any domain-specific correctness signals. Define the observation window before release so success is not declared merely because no alert fired immediately.

Preserve a clean rollback: retain the prior artifact or lockfile, understand whether the update changes persistent state, and avoid combining it with irreversible migrations. If rollback is not possible, raise the review and testing bar accordingly.

{{< checklist >}}
Risk is classified by reach, data, privilege, and reversibility.
Release notes and relevant source changes are reviewed.
Publisher, provenance, and transitive changes are verified.
Tests exercise the actual integration boundary.
The update is isolated from unrelated changes.
Staged rollout, observation, and rollback are defined.
{{< /checklist >}}
