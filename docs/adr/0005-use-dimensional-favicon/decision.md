# ADR-0005: Use a dimensional favicon

- Status: Accepted
- Date: 2026-08-24
- Decision source: Joint
- Related work: `main`

## Context

The site has a dimensional visual identity and social card but no browser icon.
A favicon needs to connect to the same design language while remaining legible
at the much smaller 16- and 32-pixel sizes used by browser tabs and bookmarks.
The selected mark is intentionally interim while the broader identity remains
open to future refinement.

## Decision

Use a transparent, three-plane dimensional mark in the site's charcoal,
violet, sage, and dusty-rose palette as the current favicon. Publish explicit
512-, 32-, and 16-pixel PNG variants from `static/`, and link all three sizes in
the shared Hugo head partial.

Validate that every generated page references existing favicon assets. Keep the
512-pixel file as the raster master used by the site; do not commit exploratory
image-generation variants.

## Alternatives considered

- **No favicon:** Avoids an interim identity decision but leaves browser tabs
  and bookmarks without a recognizable site mark.
- **Reuse the full social card:** Preserves exact artwork but its typography and
  fine construction lines are illegible at favicon sizes.
- **Create an SVG favicon:** Produces resolution-independent output, but the
  selected artwork was generated and approved as a raster asset rather than a
  maintainable vector source.
- **Publish only one large PNG:** Uses fewer files but delegates all small-size
  sampling to browsers and makes 16- and 32-pixel results less predictable.

## Consequences

- Browser tabs and bookmarks receive a recognizable Ectogon mark.
- Explicit small raster variants preserve the reviewed sampling at common
  favicon sizes.
- The site carries three closely related image files that must remain
  synchronized when the mark changes.
- Replacing the interim mark requires regenerating each size and updating this
  decision if the format or identity strategy changes materially.

## Validation

- Confirmed all three PNG files have the declared square dimensions and alpha
  transparency.
- Inspected the mark at 16 and 32 pixels for silhouette and color legibility.
- Ran the Hugo production build successfully with seven static files.
- Validated 13 generated HTML pages, metadata, feeds, and local references.
- Ran `git diff --check`.

## Follow-up

None.
