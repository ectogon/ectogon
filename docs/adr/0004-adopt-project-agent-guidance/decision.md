# ADR-0004: Adopt project agent guidance

- Status: Accepted
- Date: 2026-08-24
- Decision source: Joint
- Related work: `chore/add-project-agents`

## Context

The repository's product direction, static-site boundary, content privacy
requirements, validation commands, and deployment constraints are distributed
across source files, prior ADRs, and operational configuration. Automated
coding agents need a concise repository-scoped entry point for those invariants
before they change content or infrastructure.

## Decision

Maintain a root `AGENTS.md` that applies to the entire repository and records
project-specific guidance for:

- Ectogon's dimensional visual and editorial direction.
- Hugo content and template ownership.
- Static-only implementation and validation requirements.
- Cloudflare deployment and credential boundaries.
- Repository publication and architecture-decision practices.

Keep detailed implementation sources authoritative. Update `AGENTS.md` when a
landed decision changes the instructions agents must follow, without using it
as a substitute for design records, operational documentation, or tests.

## Alternatives considered

- **Rely only on README and ADR discovery:** Preserves fewer files but requires
  every agent to infer applicable constraints before making even small changes.
- **Use only global agent instructions:** Avoids repository maintenance but
  cannot capture Ectogon's design, content, and static deployment boundaries.
- **Duplicate all implementation details in `AGENTS.md`:** Makes the file
  self-contained but creates a large, quickly stale second source of truth.

## Consequences

- Agents receive the repository's essential constraints before acting.
- Product, content, validation, and deployment expectations are easier to apply
  consistently.
- Maintainers must keep the guidance synchronized with accepted decisions and
  repository behavior.
- Detailed configuration remains in Hugo, workflow, validation, README, and ADR
  files rather than being duplicated into agent guidance.

## Validation

- Compared the guidance with the current Hugo configuration, content layout,
  static validator, deployment workflow, README, and accepted ADRs.
- Confirmed the change does not match the production workflow's site-impacting
  path allowlist and therefore cannot alter generated output or deployment.
- Ran `git diff --check`.

## Follow-up

None.
