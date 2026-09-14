# naymyomhan.github.io 👾

Personal developer portfolio for **Nay Myo Mhan** — Full-Stack Developer specializing in **PHP (Laravel)**, **JavaScript (Next.js)**, and **C# (Unity)**, featuring an **8-Bit Pixel Art & Retro Gaming aesthetic**.

Hosted live on GitHub Pages: [https://naymyomhan.github.io](https://naymyomhan.github.io)

---

## 🕹️ Features

- **8-Bit Pixel Art Theme**: Retro typography, authentic pixel borders, and crisp pixel sprites.
- **Lo-Fi Chill Background Music (BGM)**: Built-in procedural Lo-Fi synthesizer (warm Rhodes chords, vinyl crackle, chill sub-bass, and lazy hip-hop drums) generated natively via the Web Audio API with zero external audio dependencies.
- **Built-in 8-Bit Sound Effects**: Interactive sound effects (retro bleeps, coin sounds, level up) powered by Web Audio API.
- **Curved Screen CRT System**: Vintage curved arcade monitor bezel, glass glare, scanbeam, and phosphor glow.
- **Color Palette Switcher**:
  - **Arcade Dark** (Default neon cyber arcade)
  - **Game Boy Classic** (Authentic 4-color monochrome green)
  - **Synthwave** (Vibrant 80s neon purple/pink)
- **Hero Section**: Player 1 profile card, dynamic HP/MP/XP status bars, character avatar, and quick links.
- **Quest Log (Projects Section)**: Clean, modular placeholder project cards with category filters (`All`, `Web Apps`, `Games`, `Tools`), status badges, and source/demo links.
- **Equipped Gear (Skills)**: RPG inventory style display for languages, frameworks, and tools.
- **Transmission Channel (Contact)**: Retro dialogue box with direct contact channels.
- **Zero Build Dependencies**: Pure HTML5, Modern CSS, and Vanilla JavaScript. Deploys instantly to GitHub Pages with zero build steps.
- **Responsive**: Perfectly optimized for mobile, tablet, and desktop screens.

---

## 📂 Project Structure

```
naymyomhan.github.io/
├── index.html         # Main portfolio markup & pixel art SVGs
├── css/
│   └── style.css      # Retro pixel styling, animations & theme variables
├── js/
│   └── main.js        # 8-bit audio synth, theme toggle, filters & interactions
└── README.md          # Documentation
```

---

## 🛠️ Customizing Your Projects

To replace the placeholder projects with your actual work, open `index.html` and find the `<div class="projects-grid">` section. Each project is wrapped in an `<article class="project-card" data-category="...">`:

```html
<article class="project-card" data-category="web">
  <!-- Customize preview, title, description, tags, and links -->
  <h3 class="project-title">Your Project Name</h3>
  <p class="project-desc">Brief description of your project...</p>
  <div class="project-tech-tags">
    <span class="tech-tag">#REACT</span>
    <span class="tech-tag">#NODEJS</span>
  </div>
  <div class="project-actions">
    <a href="https://your-demo.com" class="pixel-btn pixel-btn-primary pixel-btn-sm">🎮 DEMO</a>
    <a href="https://github.com/your-username/repo" class="pixel-btn pixel-btn-sm">📂 CODE</a>
  </div>
</article>
```

---

## 🚀 Local Development

You can preview the site locally using any static HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx
npx serve .
```

Then visit `http://localhost:8000` in your browser.
