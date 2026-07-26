# gmjosack.github.io

Personal portfolio site for [Made By Gare](https://gmjosack.github.io)

## Local Development

```bash
npm install
npm run dev       # Start dev server at http://localhost:4321
```

## Build & Preview

```bash
npm run build     # Build to dist/
npm run preview   # Preview the production build locally
```

## Deployment

The site deploys automatically via GitHub Actions on push to `main`. The workflow (`.github/workflows/deploy.yml`) fetches game builds (see below), runs `npm ci && npm run build`, and deploys to GitHub Pages.

To use this, the repo's **Settings > Pages > Source** must be set to **GitHub Actions**.

## Games

Games are built and released in their own private repos and are **not** checked into this repo. `games.yml` lists each game's repo, and `scripts/fetch-games.mjs` downloads the latest release zip of each into `public/games/<name>/` — both during deploys and locally:

```bash
npm run fetch-games   # requires an authed `gh` CLI
```

In CI the script authenticates with the `GAMES_READ_TOKEN` secret: a fine-grained PAT with **Contents: read** on each game repo listed in `games.yml`.

**Adding a game:** add an entry to `games.yml`, make sure the game repo publishes a release with a single zip whose contents are the web build at the archive root, and grant `GAMES_READ_TOKEN` access to that repo.

**Redeploying on game release:** the deploy workflow also triggers on `repository_dispatch` (type `game-release`), so game repos can kick off a site deploy with no code changes here. At the end of a game repo's release workflow:

```yaml
- name: Trigger site deploy
  run: |
    gh api repos/gmjosack/gmjosack.github.io/dispatches \
      -f event_type=game-release
  env:
    GH_TOKEN: ${{ secrets.SITE_DISPATCH_TOKEN }}
```

where `SITE_DISPATCH_TOKEN` is a fine-grained PAT with **Contents: read & write** on this repo. A deploy can also be triggered manually with `gh workflow run deploy.yml` or from the Actions tab.

## Adding Content

**New post:** Create a `.md` file in `src/content/posts/` with frontmatter:

```yaml
---
title: "Post Title"
date: "Month Day, Year"
published: true
---
```

**New project:** Add an entry to the `projects` array in `src/data/projects.ts`.

**New for-sale listing:** Create a `.md` file in `src/content/for-sale/`. The filename becomes the URL (`/for-sale/<filename>/`). Put photos in `public/images/for-sale/<item>/` and reference them as `/images/for-sale/<item>/photo.jpg`. Only `title` is required; see `src/content.config.ts` for the full schema and `src/content/for-sale/example-*.md` for a filled-in template.

```yaml
---
title: "Thing I'm Selling"
summary: "One line for the index card."
condition: "Open box, used twice"
price: 120                 # omit for "Make an offer"
priceNote: "or best offer" # replaces that default, or sits beside the price
retailPrice: 199.99
retailUrl: "https://..."
retailLabel: "Amazon"
images:
  - src: /images/for-sale/thing/front.jpg
    caption: "Front"
---

Markdown body goes here.
```

Two versions of the same item get one listing each, cross-linked with `seeAlso: [other-slug]` so each keeps its own price, condition, and photos while still pointing at the other.

There's no "sold" state: delete the `.md` file when the item goes, or set `published: false` to keep the text around without listing it.

**Preparing listing photos:** drop the photos into `public/images/for-sale/<listing-name>/` straight off the phone, then run:

```bash
npm run prep-listing <listing-name>          # --dry to preview without writing
```

It renames them to `photo-01.jpg`, `photo-02.jpg`, ... so the public URLs don't carry the camera's filename and timestamp, strips EXIF/XMP/IPTC metadata (losslessly, no recompression, ICC colour profile kept) and verifies none survived, then writes the `images:` block into the matching `.md`.

Re-run it any time. Captions and alt text you've written stay attached to their photo, new photos are appended to the end of the list, and if you delete one the rest resequence with their captions following along.

The `/for-sale/` section is **unlisted**: it isn't in the nav, the sitemap (filtered out in `astro.config.mjs`), or the RSS feed, and every page under it sends `noindex, nofollow`. It is deliberately *not* blocked in `robots.txt`, because a `Disallow` would stop crawlers from ever reading the `noindex`. It is still public to anyone with the URL, so don't put anything sensitive there.

**Resume update:** Edit the `jobs` array in `src/data/resume.ts`.
