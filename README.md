# ectogon.org

The Hugo-powered static blog for [ectogon.org](https://ectogon.org).

The ten field guides live in [`content/guides`](content/guides). Shared page
structure lives in [`layouts`](layouts), and files copied directly into the
generated site live in [`static`](static).

## Local development

```bash
hugo server
```

Hugo prints the local preview URL when the server starts. The project is tested
with Hugo `0.165.0`.

## Production build

```bash
hugo --gc --minify --cleanDestinationDir
python3 scripts/validate_site.py
```

Hugo writes the generated site to `public/`. That directory is intentionally
ignored because the deployment workflow rebuilds it from source.

## Adding a guide

Start a draft with:

```bash
hugo new content guides/my-guide.md
```

The section archetype creates the same front matter fields as the existing
posts: `title`, `slug`, `description`, `card_summary`,
`guide_number`, `topic`, `date`, `weight`, and `brief`. Use an ISO 8601
timestamp for `date` so feed readers receive a valid publication date. The
homepage, guide index, RSS feeds, navigation, and sitemap are generated
automatically.

## Deployment

Pushes to `main` install the pinned Hugo release, verify its checksum, build and
validate the site, and upload the generated `public/` directory to the
`ectogon` Cloudflare Pages project. Configure these values under repository
**Settings → Secrets and variables → Actions** before the first successful
deployment:

- Repository secret: `CLOUDFLARE_API_TOKEN`
- Repository variable: `CLOUDFLARE_ACCOUNT_ID`

The token should be scoped to the target Cloudflare account and the minimum
permissions needed to deploy Pages. The workflow checks both values before
installing Hugo or contacting Cloudflare, and reports each missing setting
without printing its value. If the initial push runs before configuration is
added, add both values and rerun the workflow manually. Cloudflare
authentication is not required on developer machines.

After deployment, verify the site at both endpoints:

- Cloudflare Pages: <https://ectogon.pages.dev>
- Custom domain: <https://ectogon.org>
