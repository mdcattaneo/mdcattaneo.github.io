# cattaneo 

Website for Prof. Matias Cattaneo.  Updated via HTML, compiled via Jekyll, and served via GitHub Pages.

## Structure

- Top-level files like `index.html`, `publications.html`, `research.html` correspond to `/`, `/publications/`, and `/research/` respectively. 
- Each HTML file has YAML front-matter at the top for Jekyll to process.
- Reusable fragments live in `_includes/`, e.g. header, footer, etc.
- Page layouts are in `_layouts/`; the site only uses a single layout.
- Menus are built and controlled by the `_data/navigation.yml` file.
- CSS, JS, and images are grouped under `assets/`.
- The site is built with Jekyll with a push to the `main` branch and then automatically published via GitHub Pages (live when the green checkmark appears).
- A Docker-based workflow is provided as a local development option.

## Editing the Site

- Pages are plain HTML. Edit the HTML as you normally would.
- The YAML front-matter block at the top of each page are directives to Jekyll and can otherwise be ignored.
- Jekyll will process Liquid syntax for asset/link paths.  When adding new images for example, prefer `{{ 'assets/images/award.jpg' | relative_url }}` so Jekyll injects the correct `baseurl` for GitHub Pages.

## Troubleshooting

- 404s for assets on GitHub Pages: first check that `baseurl` is set in `_config.yml` and that templates use `relative_url`. Inspect the page source and confirm asset URLs begin with `/cattaneo/assets/...`.
- Absolute `0.0.0.0` in console warnings during local dev: use `_config.local.yml` (already in repo) so generated absolute links point to `http://localhost:4000`, avoiding 0.0.0.0 addresses the browser blocks.
- If a page needs to keep its old `/page.html` URL, add `redirect_from` to the page front-matter (the `jekyll-redirect-from` plugin is enabled).
