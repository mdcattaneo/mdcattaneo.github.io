# cattaneo 

Personal site for Prof. Matias Cattaneo.  Updated via HTML, compiled via Jekyll, and served via GitHub Pages.

## Structure
- Top-level files like `index.html`, `publications.html`, `research.html` correspond to `/`, `/publications/`, and `/research/` respectively. 
- Each HTML file has YAML front-matter at the top for Jekyll to process.
- Reusable fragments live in `_includes/`, e.g. header, footer, etc.
- Page layouts are in `_layouts/`; the site only uses a single layout.
- Menus are built and controled by the `_data/navigation.yml` file.
- CSS, JS, and images are grouped under `assets/`.
- The site is built with Jekyll with a push to the `main` branch and then automatically published via GitHub Pages (live when the green checkmark appears).
- A Docker-based workflow is provided as a local development option.

## Editing the Site

Pages are plain HTML.  Edit the HTML as you normally would. The YAML front-matter block at the top of each page are directives to Jekyll and can otherwise be ignored.

Jekyll will process Liquid syntax for asset/link paths.  When adding new images for example, prefer `{{ 'assets/images/award.jpg' | relative_url }}` so Jekyll injects the correct `baseurl` for GitHub Pages.

## Base URL and GitHub Pages

The site is served from `https://pubino.github.io/cattaneo`. The production `_config.yml` includes:

```
baseurl: "/cattaneo"
```

Update the base accordingly.

Note that local development uses `_config.local.yml` to override `baseurl` and `url` so the site builds and serves from `http://localhost:4000` without any appended values in the path.

## Local development (recommended: Docker Compose)

A Docker Compose workflow is available for reproducible local development:

1. Ensure Docker and Docker Compose are installed.

2. Start the development server:

```bash
docker-compose up
```

3. Visit `http://localhost:4000` to preview the site with live reload enabled.

The `docker-compose.yml` handles:
- ARM64 platform compatibility
- Bundle installation and caching
- Live reload for development
- Volume mounting for real-time file changes

### Alternative: Direct Docker commands

If you prefer using Docker directly:

1. Build the image:

```bash
docker build -t cattaneo-site .
```

2. Run with live reload:

```bash
docker run --platform linux/arm64 -p 4000:4000 -v "$(pwd)":/srv/jekyll jekyll/jekyll:latest jekyll serve --host 0.0.0.0 --watch --livereload --config "_config.yml,_config.local.yml"
```

### Local Ruby installation

If you prefer Ruby locally, install Ruby and Bundler, then run:

```bash
bundle install
bundle exec jekyll serve --config _config.yml,_config.local.yml
```

## Building for production locally
If you want to generate a production build (the same layout GitHub Pages will serve):

```bash
bundle exec jekyll build --config _config.yml
# built files will be in _site/
```

You can then preview `_site/` with a static server, e.g. `python3 -m http.server 4001` inside `_site/`.

## Deploying
- This repo is configured to publish from `main` via GitHub Pages. Pushing to `main` triggers GitHub Pages to rebuild the site.
- After a push, wait a minute and check `https://pubino.github.io/cattaneo`.

## Troubleshooting
- 404s for assets on GitHub Pages: first check that `baseurl` is set in `_config.yml` and that templates use `relative_url`. Inspect the page source and confirm asset URLs begin with `/cattaneo/assets/...`.
- Absolute `0.0.0.0` in console warnings during local dev: use `_config.local.yml` (already in repo) so generated absolute links point to `http://localhost:4000`, avoiding 0.0.0.0 addresses the browser blocks.
- If a page needs to keep its old `/page.html` URL, add `redirect_from` to the page front-matter (the `jekyll-redirect-from` plugin is enabled).

## Helpful git workflow
- Create a branch for feature work:

```bash
git checkout -b fix/some-change
# edit files
git add .
git commit -m "Describe change"
git push -u origin fix/some-change
```

- Open a PR and merge when ready. GitHub Pages will publish from `main`.

## Contact / next steps
If you want, I can:
- Add a simple GitHub Action that builds the site and shows the generated files as an artifact before pushing to main.
- Make any remaining templates use `{{ '...path...' | relative_url }}` where I find hard-coded leading slashes.

---

Last updated: 2025-10-09
