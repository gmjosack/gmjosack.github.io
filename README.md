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

**Resume update:** Edit the `jobs` array in `src/data/resume.ts`.
