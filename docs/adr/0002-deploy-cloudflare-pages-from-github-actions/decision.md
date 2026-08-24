# ADR-0002: Deploy Cloudflare Pages from GitHub Actions

- Status: Accepted
- Date: 2026-08-23
- Decision source: Joint
- Related work: Initial `main` publication

## Context

The site is hosted by Cloudflare Pages, while deployment credentials should be
held by GitHub Actions rather than developer machines. Deployments must build
the Hugo source reproducibly, reject invalid output, and fail clearly when the
repository has not yet been configured with Cloudflare credentials.

## Decision

Deploy pushes to `main` through GitHub Actions using Cloudflare's Wrangler
action. The workflow will:

1. Require `CLOUDFLARE_API_TOKEN` as a repository secret and
   `CLOUDFLARE_ACCOUNT_ID` as a repository variable.
2. Fail before build or deployment when either value is absent, without
   printing either value.
3. Scope the Cloudflare token only to the credential preflight and deployment
   action, never to checkout, Hugo, or repository-owned build scripts.
4. Pin GitHub actions to full commit SHAs and pin Wrangler to an exact version.
5. Download Hugo `0.165.0` from its official release, verify the pinned SHA-256
   checksum, and build the site in CI.
6. Validate the generated output before deploying `public/` to the `ectogon`
   Cloudflare Pages project.
7. Support manual reruns through `workflow_dispatch` after repository settings
   are configured.

## Alternatives considered

- **Deploy from developer machines:** Rejected because it would distribute
  production authority locally and make releases harder to reproduce.
- **Commit generated output and upload it without rebuilding:** Rejected because
  generated content could drift from reviewed source.
- **Use Cloudflare's repository integration:** Not selected because the chosen
  workflow requires GitHub-held credentials and an explicit, reviewable build
  and validation sequence.
- **Store the account ID as a secret:** Rejected because the identifier is not a
  credential; a repository variable makes its different sensitivity explicit.

## Consequences

- A push to `main` can deploy only after the GitHub repository is configured.
- The first workflow run may fail intentionally if settings are added after the
  initial push; it can then be rerun manually.
- The API token must remain narrowly scoped and rotated through GitHub settings.
- Hugo upgrades require updating both the pinned version and verified checksum.
- Action and Wrangler upgrades require explicit reviewed pin changes.
- Deployment availability depends on GitHub Actions, GitHub release downloads,
  and Cloudflare's deployment API.

## Validation

- The GitHub Actions YAML parses successfully.
- The pinned Linux Hugo archive was downloaded and its SHA-256 checksum was
  verified locally.
- The credential preflight shell block passes syntax validation.
- The production Hugo build and generated-site validator pass locally.

## Follow-up

None.
