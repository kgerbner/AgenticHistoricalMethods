# 🌸 Agentic Historical Methods

A cute, responsive academic portfolio site about **how historians can use Claude as
research support**. Built as a plain static site (HTML/CSS/JS, no build step) with a
Sanrio-inspired pastel palette and lots of p5.js animation.

## ✨ Features

- **Six pages:** Home, About, Claude for Historians, Tutorials, Publications/CV, Blog
- **Sanrio-inspired design system** — pastel tokens, rounded shapes, cute micro-interactions
- **p5.js animation** — floating hero particles, an ambient background, and a sparkle cursor trail
- **Responsive** — mobile-first, hamburger nav, fluid type
- **Accessible** — respects `prefers-reduced-motion`, semantic HTML, accessible color contrast
- **Data-driven** — Publications render from `data/publications.json`; the blog index renders
  from `blog/posts.json`. No build step required.

## 📁 Structure

```
index.html / about.html / claude-for-historians.html
tutorials.html / publications.html / blog.html
blog/            individual post pages + posts.json
css/styles.css   design system
js/              components (partial includes), main (UI), p5 sketches, data renderers
partials/        shared nav + footer (edited once, injected everywhere)
data/            publications.json
assets/          favicon, images, cv.pdf (add your own)
```

## 🚀 Local development

The site uses `fetch()` to inject the shared nav/footer and to load JSON, so it must be
served over HTTP — opening files with `file://` will leave the nav/footer empty. Run any
static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## ✏️ Editing content

- **Nav / footer:** edit `partials/nav.html` and `partials/footer.html` once.
- **Publications:** edit `data/publications.json` (`type`: `book` | `article` | `talk` | `other`).
- **Add a blog post:** create `blog/<slug>.html` (copy an existing post) and add an entry to
  `blog/posts.json` with a matching `slug`.
- **Colors / fonts:** tweak the CSS custom properties in `:root` at the top of `css/styles.css`.
- **CV:** drop a `assets/cv.pdf` for the download button on the Publications page.

## 🌐 Deploy (GitHub Pages)

1. Push to the `main` branch.
2. In **Settings → Pages**, set **Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

### Custom domain (optional)

1. Rename `CNAME.example` to `CNAME` and set it to your domain (one line, no protocol).
2. Add DNS records at your registrar:
   - **Subdomain** (e.g. `www`): a `CNAME` record → `<your-username>.github.io`
   - **Apex** (e.g. `example.org`): GitHub's `A`/`AAAA` records (see GitHub Pages docs)
3. In **Settings → Pages**, enter the domain and enable **Enforce HTTPS**.

### Analytics (optional)

A privacy-friendly snippet is stubbed (commented out) in `partials/footer.html`. Uncomment
the GoatCounter or Plausible line and add your site code — no cookie banner needed.

## 🛠️ Tech

Plain HTML/CSS/JS · [p5.js](https://p5js.org/) (CDN) · Google Fonts (Fredoka + Quicksand) ·
GitHub Pages. Built with 💖 and a love of the archive.
