---
title: "Treat Database Migrations as Deployments"
slug: "database-migrations"
description: "Schema changes alter a shared, durable contract. Give them explicit ordering, observability, and recovery instead of hiding them inside application startup."
card_summary: "Give schema changes their own safety model and lifecycle."
guide_number: "03"
topic: "Data"
date: 2026-08-23T00:00:00-04:00
weight: 3
draft: false
brief:
  - "Preserve compatibility across releases."
  - "Run migrations once, visibly."
  - "Separate schema rollback from code rollback."
  - "Measure long-running data work."
---

## A schema outlives a process

Application instances are replaceable; database state is not. A deployment can roll back in seconds while a destructive migration may be irreversible. Treating both as one atomic operation creates a false sense of safety.

The safest default is compatibility across a deployment window. Old and new application versions should be able to operate while the rollout is in progress. That requirement shapes how columns, constraints, indexes, and data transformations are introduced.

## Use expand and contract

Break incompatible changes into stages. First expand the schema with additive structures. Then deploy code that can use the new shape while tolerating the old one. Backfill data separately when necessary. Only after all readers and writers have moved should you contract by removing the obsolete structure.

### A typical sequence

1. Add a nullable column or parallel table.
2. Deploy code that writes both formats when needed.
3. Backfill existing rows in controlled batches.
4. Switch reads to the new structure.
5. Verify old usage has stopped.
6. Remove compatibility code and obsolete schema later.

{{< callout label="Key distinction" >}}
Rolling application code back does not automatically reverse data already transformed by a migration. Plan those two recoveries separately.
{{< /callout >}}

## Run migrations as explicit jobs

A migration should have one visible execution identity, bounded retries, a clear timeout, and logs retained independently of short-lived application containers. Do not let every application replica race to update the schema during startup.

Use a database-level lock or migration ledger to prevent concurrent execution. Make scripts idempotent where practical, but do not use idempotence as an excuse for uncontrolled retries. Some operations are safe to repeat; others require an operator to inspect partial progress first.

Define deployment ordering intentionally. An additive migration may run before the application update. A cleanup migration may need a later release. Encode those relationships in the release process rather than relying on someone to remember them.

## Respect operational cost

DDL behavior varies by database engine and version. An apparently simple alteration may lock a large table, rewrite every row, or consume significant replication capacity. Test with production-shaped data, inspect execution plans, and understand online-operation support before scheduling the change.

For backfills, work in resumable batches. Track progress with durable cursors, rate-limit to protect foreground traffic, and expose throughput, error rate, and remaining work. A backfill is a production workload and should be observable like one.

{{< checklist >}}
The migration is compatible with adjacent application versions.
Only one controlled job can execute it.
Timeout, retry, and partial-failure behavior are defined.
Large operations are tested with realistic data volume.
Backfills are resumable and rate-limited.
Code rollback and data recovery have separate plans.
{{< /checklist >}}
