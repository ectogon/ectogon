# ADR-0001: Adopt Hugo for content publishing

- Status: Accepted
- Date: 2026-08-23
- Decision source: Joint
- Related work: Initial `main` publication

## Context

Ectogon needs to remain a fully static site while supporting a growing set of
long-form field guides. The initial implementation duplicated navigation,
metadata, and page structure across hand-authored HTML files, making future
posts expensive to add and easy to render inconsistently.

## Decision

Use Hugo as the static site generator. Store field guides as Markdown under
`content/guides/`, render them through repository-owned templates under
`layouts/`, and keep directly copied assets under `static/`. Preserve existing
guide URLs through explicit slugs. Generate the `public/` publish directory at
build time and exclude it from version control.

Keep the published site free of runtime JavaScript and server-side behavior.
Disable raw Markdown HTML, use constrained shortcodes for the two custom content
components, and use Hugo-generated RSS feeds, navigation, and sitemap output.

## Alternatives considered

- **Continue maintaining standalone HTML pages:** Rejected because shared page
  structure, metadata, navigation, and homepage cards would remain duplicated.
- **Adopt a JavaScript application framework:** Rejected because the site does
  not require client state or server rendering, and the additional runtime and
  dependency surface would not improve the publishing workflow.
- **Commit generated `public/` output:** Rejected because source and generated
  HTML could drift and code review would include redundant build artifacts.

## Consequences

- New guides can be created as Markdown with a section archetype.
- Shared templates keep metadata, navigation, and design consistent.
- Content authors cannot inject arbitrary raw HTML; new custom markup requires a
  repository-reviewed shortcode or render hook.
- Hugo becomes a required local and CI build dependency.
- Production output must be built before validation or deployment.
- Existing guide URLs and user-visible post content remain stable.

## Validation

- Hugo `0.165.0` builds the site without warnings.
- Conversion checks verified the ten guide bodies and homepage index against
  the original static pages.
- The generated site validator checks 13 HTML pages, local references, feeds,
  metadata, sitemap, robots policy, Cloudflare headers, and active-content
  patterns.
- `hugo server` served the homepage, guide index, a guide, and RSS feed with
  successful HTTP responses.

## Follow-up

None.
