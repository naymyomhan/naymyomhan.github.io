# naymyomhan.github.io

Portfolio of **A Dev Dude**, Full-Stack, Mobile & AI Engineer, plus the landing pages and privacy policies for the A Dev Dude apps on Google Play.

Live site: [https://naymyomhan.github.io](https://naymyomhan.github.io)

## Structure

```
naymyomhan.github.io/
├── index.html                 # Portfolio home: intro, projects, skills, contact
├── css/style.css              # Shared styles (light/dark follows the OS setting)
├── projects/                  # App landing pages / case studies
│   ├── easy-thai.html
│   ├── invoice-maker.html
│   ├── 1000-dreams.html
│   ├── pixel-art-maker.html
│   └── rivo-ai.html
├── privacy/                   # App privacy policies (linked from Google Play)
├── privacy-policy/            # Identical copies kept so older Play Console links keep working
├── images/                    # App icons, feature graphics and screenshots
├── app-ads.txt                # AdMob authorized sellers file (must stay at the site root)
└── robots.txt
```

No build step and no JavaScript: plain HTML and CSS served by GitHub Pages.

## Updating an app

- **Landing page:** edit `projects/<app>.html`. Each page sets its accent colour with a body class (`theme-easythai`, `theme-invoice`, `theme-dreams`, `theme-pixel`, `theme-rivo`) defined at the top of `css/style.css`.
- **Privacy policy:** edit `privacy/<app>.html`, update the "Last updated" date, then copy the file over `privacy-policy/<app>.html` so both URLs stay identical.
- **New app:** copy an existing project page and privacy page, add its card to the Work section and its policy link to the footer in `index.html`.
- After changing `css/style.css`, bump the `?v=` query in the pages' stylesheet link so browsers pick up the new file.

## Local preview

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.
