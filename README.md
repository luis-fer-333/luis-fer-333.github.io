# Luis Núñez — Analytics Engineer Portfolio

Hugo + PaperMod portfolio site, optimized for Analytics Engineer positioning.

## Local preview

```bash
# One-time: install Hugo
brew install hugo

# One-time: install the PaperMod theme (as a git submodule)
cd portfolio
git init  # if not already a repo
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod

# Run the dev server (auto-reloads on change)
hugo server -D
```

Visit http://localhost:1313.

If you don't want to use git submodules:

```bash
git clone https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod --depth=1
```

## Site structure

```
portfolio/
├── hugo.toml                    # site configuration (base URL, menu, params)
├── content/
│   ├── _index.md                # landing page (hero + featured projects)
│   ├── about.md                 # bio + contact
│   ├── projects/
│   │   ├── _index.md            # projects listing page
│   │   ├── nobel-prize-data-lake.md        ⭐ featured
│   │   ├── movie-database-etl.md           ⭐ featured
│   │   ├── airbnb-valencia-bi.md           ⭐ featured
│   │   └── ...10 more project pages
│   └── posts/
│       └── _index.md            # blog scaffold (for future posts)
├── static/
│   └── images/                  # thumbnails and diagrams
└── themes/PaperMod/             # theme (as submodule or cloned)
```

## Editing project pages

Every project page is a markdown file under `content/projects/`. The front matter drives ordering and metadata:

```yaml
---
title: "Project Title"
date: 2024-01-01
draft: false
weight: 1              # lower = higher on the listing page
tags: ["ETL", "SQL"]
featured: true         # controls display on the landing page
summary: "One-line summary that appears in listings"
cover:
  image: /images/project-cover.jpg
  alt: "Project screenshot"
---

# Project content (markdown)
```

## Deploying to GitHub Pages

1. Push the `portfolio/` folder to a repo called `luis-fer-333.github.io`
2. Build with `hugo --minify` in a GitHub Actions workflow
3. Output goes to `public/`, which is served by GitHub Pages

Example workflow at `.github/workflows/hugo.yml` (add when ready to deploy):

```yaml
name: Deploy Hugo
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
      - uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: latest
          extended: true
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```
