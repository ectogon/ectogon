# ADR-0006: Use Playwright for local browser QA

- Status: Accepted
- Date: 2026-08-29
- Decision source: AI-assisted
- Related work: `chore/add-local-browser-qa`

## Context

Layout and interaction changes need repeatable checks in a real browser even when
interactive browser control is unavailable to a contributor or automation agent.
The existing Hugo build and static validator catch generated-output defects, but
they cannot exercise responsive layout, browser runtime errors, keyboard focus,
image loading, or navigation behavior.

## Decision

Use `@playwright/test` 1.62.1 with its matching Chromium runtime as the
repository-owned local browser-QA tool. Node.js 22 or newer is the supported
runtime. `make browser-qa-install` installs Chromium once, and
`make browser-qa` starts an isolated Hugo server and checks representative home,
guide-index, and guide-detail routes at desktop and mobile viewports.

The generic suite checks document responses, browser and request errors,
horizontal overflow, broken sourced images (including lazy images), keyboard
focus, controlled mobile-navigation state when present, and a bounded set of
same-origin links. It records screenshots, traces, and an HTML report in ignored
local directories. Environment variables may select another port, an existing
preview URL, or a different route set. This decision adds local tooling only; it
does not add a GitHub Actions browser job.

## Alternatives considered

- **Rely on integrated browser control:** This is useful when available, but it is
  not a reproducible repository dependency and may be unavailable in a session.
- **Use only Hugo and static validators:** These remain required, but they do not
  execute the rendered site in a browser.
- **Add hosted browser testing immediately:** Continuous enforcement may be useful
  later, but it adds CI time and operational configuration that are not required
  for the local fallback.

## Consequences

- Browser QA has a documented, repeatable command and fixed browser/tool versions.
- Contributors download and maintain a Playwright Chromium binary outside the
  repository and incur several seconds of local test time.
- Generic smoke coverage is a baseline; changes with new behavior still require
  focused assertions and human review of relevant screenshots.
- Decorative geometry must not make the document horizontally scrollable; the
  viewport now clips paint outside both the root and body bounds.
- Browser QA is not enforced by branch protection or deployment workflows.

## Validation

- `make validate`
- `make browser-qa` (six desktop/mobile route checks passed)
- `git diff --check`

## Follow-up

None.
