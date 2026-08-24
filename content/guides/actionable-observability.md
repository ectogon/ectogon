---
title: "Observe What Users Actually Experience"
slug: "actionable-observability"
description: "Telemetry becomes useful when it connects user-visible outcomes to the internal work that produced them."
card_summary: "Start with outcomes, then connect them to system signals."
guide_number: "06"
topic: "Reliability"
date: 2026-08-23T00:00:00-04:00
weight: 6
draft: false
brief:
  - "Start with service outcomes."
  - "Alert on symptoms, diagnose with causes."
  - "Connect metrics, logs, and traces."
  - "Give every alert a next action."
---

## Begin at the service boundary

Infrastructure metrics are necessary, but a healthy CPU graph does not prove that a user can complete a request. Start with the promises the service makes: successful responses, acceptable latency, fresh data, completed jobs, or durable writes.

Turn those promises into service-level indicators with explicit good and total events. Define objectives over meaningful windows. This creates a shared language for reliability and helps distinguish a momentary anomaly from a sustained threat to the user experience.

{{< callout label="Signal hierarchy" >}}
Page on user-visible symptoms. Use internal saturation, error, dependency, and resource signals to explain the symptom.
{{< /callout >}}

## Instrument the path, not just the parts

Use stable request or correlation identifiers across boundaries. Emit structured logs with consistent fields, metrics with controlled cardinality, and traces that preserve meaningful parent-child relationships. Operators should be able to move from a service-level symptom to a representative request and then to the failing dependency.

Choose telemetry fields as a contract. Service, environment, region, operation, result, and version are often useful. Avoid dimensions containing user identifiers, full URLs, unbounded error strings, or other values that create cost and privacy risk.

### Measure asynchronous work

Queues and scheduled jobs need outcome signals too: age of the oldest work item, completion latency, retry rate, dead-letter volume, and throughput. Queue depth alone can rise during healthy bursts or remain low while poisoned work fails repeatedly.

## Make alerts earn attention

An alert should identify an urgent condition that requires a human decision. If automation can safely resolve it, automate it. If no action exists, keep it as a dashboard signal until one does.

Alert on sustained impact or rapid error-budget consumption rather than isolated thresholds. Include the affected service and scope, a concise description of the user impact, a relevant dashboard, recent changes, and the first diagnostic step. Test links and ownership regularly.

Review noisy alerts as defects. Track false positives, duplicate pages, and alerts that resolve before anyone can act. Silence should mean the system is healthy—not that responders stopped trusting it.

## Build dashboards for decisions

Organize dashboards from outcomes to causes. Begin with traffic, success, latency, and freshness. Follow with dependency health, saturation, queues, and resource constraints. Mark releases and significant configuration changes so timing is visible.

Keep exploratory dashboards separate from operational ones. An operational dashboard should be stable enough that responders know where to look. Revisit it after incidents and remove panels that did not contribute to a decision.

{{< checklist >}}
User-visible success and latency are measured.
Objectives and error-budget policy are explicit.
Telemetry uses consistent bounded dimensions.
Requests can be followed across service boundaries.
Every page has an owner and a first action.
Dashboards are reviewed after real incidents.
{{< /checklist >}}
