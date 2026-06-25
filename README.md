# cattaneo

Personal academic website for Prof. Matias D. Cattaneo (Princeton University), built with Jekyll and published through GitHub Pages.

## Layout

- Top-level HTML files define the main pages.
- Shared markup lives in `_includes/` and `_layouts/`.
- Navigation is configured in `_data/navigation.yml`.
- Assets live in `assets/`; PDFs are organized under folders such as `papers/`, `books/`, and `cv/`.

## Local Development

```sh
bundle exec jekyll build --trace
bundle exec jekyll serve --config _config.yml,_config.local.yml
```

Use Jekyll helpers such as `{{ 'assets/images/example.jpg' | relative_url }}` for internal asset links.
