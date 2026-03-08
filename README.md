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

The site deploys automatically via GitHub Actions on push to `master`. The workflow (`.github/workflows/deploy.yml`) runs `npm ci && npm run build` and deploys to GitHub Pages.

To use this, the repo's **Settings > Pages > Source** must be set to **GitHub Actions**.

## Adding Content

**New blog post:** Create a `.md` file in `src/content/posts/` with frontmatter:

```yaml
---
title: "Post Title"
date: "Month Day, Year"
published: true
---
```

**New project:** Add an entry to the `projects` array in `src/data/projects.ts`.

**Resume update:** Edit the `jobs` array in `src/data/resume.ts`.