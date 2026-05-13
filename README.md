# Portfolio

Independent static multi-page portfolio built in `version_2.0`.

## Pages

- `index.html` - compact homepage with profile, works, featured projects, skills, and social preview.
- `pages/about.html` - full profile page.
- `pages/works.html` - all works with category filters.
- `pages/projects.html` - featured project details.
- `pages/skills.html` - full skills page.
- `pages/contact.html` - social and contact links.
- `pages/websites.html`, `pages/tools.html`, `pages/illustrations.html`, `pages/games.html`, `pages/photography.html` - category pages with expansion space.
- `docs/design-system.md` - source of truth for future UI and styling decisions.
- `locales/en.json`, `locales/zh.json` - locale reference files; runtime dictionaries are mirrored in `assets/js/site.js` for direct `file://` use.

## Editing Notes

Before changing UI, read `docs/design-system.md`. Replace placeholder titles, descriptions, tags, and links through the i18n keys in `assets/js/site.js` and keep locale JSON references synchronized. Shared visual styles live in `assets/css/site.css`, and shared navigation/filter/language behavior lives in `assets/js/site.js`.
