---
title: "Keep Secrets Out of the Artifact"
slug: "runtime-secrets"
description: "Software should know which secret it needs, not carry the secret with it. Deliver sensitive values at runtime and keep their authority narrow."
card_summary: "Deliver sensitive values at runtime and minimize their reach."
guide_number: "05"
topic: "Security"
date: 2026-08-23T00:00:00-04:00
weight: 5
draft: false
brief:
  - "Commit references, never values."
  - "Prefer short-lived identity."
  - "Scope every credential narrowly."
  - "Design rotation before the first incident."
---

## Separate code from authority

Artifacts travel widely. They are copied into caches, registries, developer machines, test environments, and backups. Any secret embedded during the build inherits that distribution. Even if the artifact is private today, its lifetime may exceed the credential's intended audience.

Keep secret values out of source control, build arguments, container layers, static assets, and generated manifests. Commit the contract instead: the logical secret name, expected keys, validation rules, and the identity authorized to retrieve it.

{{< callout label="Boundary" >}}
Configuration says what a workload needs. Identity decides whether it may receive it. The secret system supplies the value at runtime.
{{< /callout >}}

## Prefer identity over inventory

A long-lived token is inventory that must be stored and rotated. Workload identity turns authentication into a short-lived exchange based on who is running, where, and under which policy. Prefer provider-native or standards-based federation when available.

When static credentials are unavoidable, scope them to the smallest resource set and operation. Separate read from write, production from non-production, and deployment from administration. Give each workload its own identity so revoking one does not interrupt unrelated services.

## Choose a delivery model deliberately

Environment variables are simple but easy to expose through process inspection, crash reports, and debug output. Mounted files can support atomic replacement but require careful permissions and reload behavior. Direct retrieval through a client gives fine-grained control but adds availability and caching decisions.

Whichever model you choose, define what happens when retrieval fails, a value expires, or rotation occurs while the process is running. Fail closed for sensitive operations, avoid infinite retry storms, and surface a clear health signal without logging the value.

### Logging discipline

Redact by field and type rather than chasing known strings. Disable request-body logging around authentication endpoints. Treat command tracing, support bundles, and telemetry attributes as possible exfiltration paths. A secret that appears once in a log should be considered compromised.

## Make rotation routine

Rotation should be an ordinary operation, not a bespoke emergency. Support overlapping validity when protocols allow it: issue the new credential, update consumers, verify use, then revoke the old credential. Record ownership and an expected rotation interval.

Practice revocation. Confirm that disabling a credential takes effect within the expected time, dependent caches expire, alerts distinguish authentication failure from service failure, and recovery does not require editing source.

{{< checklist >}}
No secret values exist in source or built artifacts.
Each workload has a distinct, narrowly scoped identity.
Runtime delivery and reload behavior are documented.
Logs, traces, and errors are redacted by design.
Rotation supports overlap and verification.
Revocation and leak response are tested.
{{< /checklist >}}
