# ADR-0003: Trigger deployments from site inputs

- Status: Accepted
- Date: 2026-08-23
- Decision source: Joint
- Related work: `main`

## Context

The deployment workflow originally ran for every push to `main`, including
changes to documentation and repository metadata that cannot alter Hugo's
generated output. Those runs consumed CI capacity and could create redundant
Cloudflare Pages deployments.

The workflow still needs to run whenever a source, configuration, dependency,
or deployment setting can affect the published site. Operators also need a way
to rebuild on demand without creating an artificial source change.

## Decision

Use GitHub Actions' native `push.paths` filter as an allowlist of site inputs.
Trigger automatic builds for changes to:

- Hugo content, layouts, static files, assets, data, translations, and themes.
- Hugo configuration, Go module or workspace files, and vendored modules.
- The deployment workflow itself, because it pins the Hugo version and defines
  how generated output is built and published.
- Validation scripts, because repository-owned executable code runs against
  `public/` before the directory is uploaded.
- Cloudflare Functions, Wrangler configuration, and tracked `.wrangler` state.
  These paths trigger fail-closed validation rather than enabling server-side
  behavior; the validator also rejects a generated `public/_worker.js`.

Do not trigger automatic builds for documentation, ADRs, authoring archetypes,
or repository metadata. Keep `workflow_dispatch` available as an unfiltered
manual rebuild path.

Run validation with Python isolated mode. After validation succeeds, create a
unique directory under the GitHub runner's temporary path for the token-bearing
Wrangler action, force npm as its package manager, and pass the generated
`public/` directory by absolute path. This prevents sibling Python modules,
repository package-manager files, lifecycle scripts, and local Wrangler
binaries from influencing validation, dependency installation, or deployment.

## Alternatives considered

- **Run on every push:** Simple and conservative, but repeatedly builds and
  deploys identical output for non-site changes.
- **Build every push and compare `public/` before deployment:** Avoids redundant
  deployments but does not avoid the build, requires a trusted prior artifact
  or production comparison, and adds stateful comparison logic.
- **Use `paths-ignore`:** Easier to start with, but a new unrelated root file
  would trigger a build by default and weaken the stated site-input boundary.
- **Allow or reject every repository package-manager input:** This would expand
  an error-prone path inventory while still running secret-bearing tooling in
  the repository checkout.

## Consequences

- Documentation-only and repository-maintenance pushes do not consume a Hugo
  build or create a Cloudflare deployment.
- A push containing at least one matching site input still runs the complete
  build, validation, and deployment job.
- New categories of Hugo inputs must be added to the allowlist when introduced.
- Cloudflare Functions, Worker output, and repository-owned Wrangler
  configuration are rejected to preserve the static-only publishing boundary.
- The Wrangler action cannot discover package-manager settings, lifecycle
  scripts, or local binaries from the repository checkout.
- Python validation cannot import repository sibling modules implicitly, and a
  unique post-validation directory prevents earlier steps from pre-populating
  Wrangler's working directory.
- Operators can use manual dispatch to recover from a missed path or request a
  clean rebuild.
- GitHub's documented path-filter diff limits still apply; very large pushes or
  diff timeouts can cause a conservative extra run or, in the 3,000-file edge
  case, miss a matching path outside the evaluated set.

## Validation

- Parsed the workflow as YAML after adding the path filter.
- Verified that every current Hugo build input is covered by a matching path.
- Confirmed documentation and ADR paths are outside the automatic trigger.
- Verified forbidden Cloudflare server and configuration inputs fail validation.
- Confirmed the validator succeeds in Python isolated mode.
- Inspected the pinned action implementation to confirm its commands and
  package-manager detection use the configured isolated working directory.
- Rebuilt and validated the generated site without changing its output.

## Follow-up

None.
