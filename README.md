# saumyadip-das-2003.github.io

This repository contains a single‑page E‑Portfolio for **Saumyadip Das** (all content is on `index.html`) with a focus on research, publications, projects, and contact options. Legacy multi-page versions are backed up in the `/archive` folder.

## What I added
- `index.html`, `about.html` (inline About content on Home), `publications.html`, `projects.html`, `videos.html`, `contact.html`
- `css/styles.css`, `js/main.js`
- Embedded a placeholder Google Form in `contact.html` (replace the dummy form URL with your actual form when ready)
- Uses Bootstrap 5 and the Inter font for a clean, responsive look

## Local testing
1. Open `index.html` in a browser (double-click or use a local static server).
2. Ensure `Saumyadip_Das%20(2).pdf` and `Saumyadip%20Das.png` remain in the repository root (they are referenced by the pages).

## Deploy to GitHub Pages
1. Push the branch to GitHub (e.g., `main` or `gh-pages`).
2. In the repository -> **Settings** -> **Pages**, set the source to the branch and root folder. Save.
3. Your site should be available at `https://saumyadip-das-2003.github.io` after a few minutes.

## Next steps (optional)
- Replace the embedded Google Form `src` in the Contact section of `index.html` with your form's embed URL (make sure "anyone with the link" is allowed); paste the link here and I’ll replace it for you.
- The LaTeX source `main (2).tex` is included in the repository — I parsed it and added ResearchGate links for your conference papers on `publications.html`.
- Placeholders for **Google Scholar** and **IEEE author profile** are present in the header/footer — replace the `href="#"` links with your profiles when ready.

- Add video links to `videos.html` and I will embed them for you.
- If you want server-side features (PHP contact endpoints), let me know and we can add a simple backend or use serverless endpoints.