# Ectogon repository guidance

## Scope

These instructions apply to the entire repository.

## Product and visual direction

- Ectogon evokes shapes outside the third dimension that cannot be fully
  expressed from within it, like a right angle in four dimensions.
- Preserve the current quiet, dimensional design: soft colors, restrained
  contrast, generous space, and geometry that suggests an incomplete
  projection rather than a literal diagram.
- Keep the tagline **Angles Outside**.
- Keep guides general and reusable. Do not include employer-, client-, or
  company-specific names, systems, incidents, credentials, or internal facts.

## Site architecture

- This is a Hugo-generated static site. Use Hugo `0.165.0` when reproducing CI.
- Author guides in `content/guides/`; keep shared markup in `layouts/` and
  directly copied assets in `static/`.
- Treat `public/` as disposable generated output. Do not hand-edit or commit it.
- Do not add runtime JavaScript, Cloudflare Functions, `_worker.js`, server-side
  behavior, or repository-owned Wrangler configuration.
- Raw Markdown HTML is disabled. Use narrowly scoped, escaping shortcodes or
  render hooks for custom content markup.
- Preserve existing guide slugs and URLs unless a redirect and migration are
  explicitly part of the requested change.

## Content changes

- Create guides with `hugo new content guides/<slug>.md` and retain the section
  front matter contract documented in `README.md`.
- Use an ISO 8601 timestamp for guide dates so Hugo emits valid feed dates.
- Keep card summaries concise and make every guide useful without private or
  company-specific context.
- Update shared templates instead of repeating structural HTML across guides.

## Validation

Run the production build and static-site validator before committing a change
that can affect generated output:

```bash
hugo --gc --minify --cleanDestinationDir
python3 -I scripts/validate_site.py
```

- Keep the validator's static-only checks intact or strengthen them when new
  output types are introduced.
- Verify responsive behavior and keyboard-visible focus when changing layouts
  or styles.
- Confirm generated guide bodies and URLs remain stable during content or
  template migrations.

## Deployment

- Production deployment runs through `.github/workflows/deploy.yml`; local
  development must not require Cloudflare credentials or invoke Wrangler.
- Keep GitHub actions pinned to full commit SHAs and tool versions pinned to
  exact versions with integrity checks where available.
- Keep `CLOUDFLARE_API_TOKEN` scoped only to preflight and the isolated deploy
  action. Never print it or expose it to repository-owned build code.
- Keep the workflow's `push.paths` allowlist synchronized with every source,
  executable, configuration, or dependency path that can affect deployment.
- Preserve `workflow_dispatch` as the manual recovery and rebuild path.

## Repository changes

- Keep a linear history and do not push or open a pull request unless the user
  explicitly asks.
- Record material architecture or operational decisions under `docs/adr/`
  before publishing the change.
- Do not commit secrets, local Cloudflare state, Hugo caches, or generated
  output.
