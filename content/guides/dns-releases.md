---
title: "Treat DNS Changes Like Distributed Releases"
slug: "dns-releases"
description: "DNS changes propagate through independent caches and control planes. Release them in stages, with both old and new paths ready."
card_summary: "Plan propagation, validation, rollback, and certificate timing."
guide_number: "07"
topic: "Networking"
date: 2026-08-23T00:00:00-04:00
weight: 7
draft: false
brief:
  - "Inventory before editing."
  - "Lower TTLs ahead of time."
  - "Prepare certificates and origins first."
  - "Keep the old path alive through propagation."
---

## DNS has a long memory

A DNS update can be accepted immediately by the authoritative provider while recursive resolvers and clients continue serving older answers. Negative responses can also be cached. That means a migration temporarily creates a mixed world in which different users reach different destinations.

Plan for that mixed state instead of trying to eliminate it. Both the old and new destinations should serve compatible traffic for at least the expected cache window. Avoid making a DNS cutover depend on an instantaneous global switch.

## Start with a complete inventory

Record the authoritative nameservers, registrar, zone owner, DNSSEC state, certificate authority restrictions, and every record that matters. Include less visible records for mail, verification, service discovery, and delegated subdomains. A migration that preserves the website but breaks mail is still a failed migration.

Capture current answers from multiple public resolvers and save a zone export when the provider supports it. Confirm which records are intentionally proxied, flattened, synthesized, or managed by another service. Provider-specific behavior must be translated, not blindly copied.

{{< callout label="Before the clock starts" >}}
Verify the new origin using its provider hostname or a temporary test hostname. DNS should be the final routing step, not the first time the service receives real traffic.
{{< /callout >}}

## Stage the cutover

Lower relevant TTLs at least one previous-TTL window before the change. Keep the value reasonable; extremely low TTLs increase query load and do not force clients to honor ideal behavior. Wait long enough for the old TTL to age out before assuming the lower value is effective.

Prepare TLS certificates, hostname validation, redirects, security headers, and origin routing in advance. Test apex and common subdomains independently. If nameservers are changing, reproduce the full zone and verify delegation requirements before updating the registrar.

Change one layer at a time when possible. Separating nameserver migration, content migration, and redirect changes makes failures easier to localize.

## Verify from outside

Query authoritative nameservers directly, then query several recursive resolvers. Test HTTP and HTTPS, certificate chains, redirects, IPv4 and IPv6 where applicable, and representative geographic locations. Confirm the response body or a unique release marker—not only the status code.

Define rollback before cutover. Keep the old service operational, retain prior records, and know which changes are reversible within the propagation window. Remember that rollback is also a DNS change and will propagate gradually.

{{< checklist >}}
Registrar, nameservers, DNSSEC, and zone ownership are known.
All website, mail, verification, and delegated records are inventoried.
TTLs were lowered one full prior-TTL window ahead.
The new origin and certificate work before cutover.
Old and new destinations can overlap safely.
External verification and rollback steps are written down.
{{< /checklist >}}
