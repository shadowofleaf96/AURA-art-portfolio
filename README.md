# AURA &mdash; Fine Art, Architectural & Editorial Photography Portfolio

A responsive single-page photography and art portfolio built strictly with **pure HTML5 and CSS3** (zero frameworks, zero JavaScript).

Designed around an editorial aesthetic for visual artist **Elena Vance**, featuring an image gallery grid as the centerpiece with proper `object-fit: cover` treatments, semantic landmarks, working navigation, global `box-sizing: border-box`, custom CSS color variables, and an interactive "Book a Shoot" reservation experience.

---

## Technical Specifications & Requirements Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Only HTML & CSS** | Pure HTML5 and CSS3 only. Zero JavaScript scripts, zero external libraries. | &check; |
| **GitHub Repo with Real Commits** | Initialized Git repository with clean, incremental, atomic commit history. | &check; |
| **Single Page & Responsive** | Fluid single-page architecture that scales flawlessly from 320px mobile to 4K displays. | &check; |
| **Semantic Landmarks** | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<aside>`, `<footer>`. | &check; |
| **One `<h1>`** | Exactly one `<h1>` in the hero section: `Capturing the Silent Poetry of Light & Form`. | &check; |
| **Working Nav Links** | Navigation links (`#gallery`, `#about`, `#services`, `#book`, `#top`) with smooth scrolling. | &check; |
| **Global `box-sizing: border-box`** | Applied universally via `*, *::before, *::after { box-sizing: border-box; }`. | &check; |
| **CSS Variables for Colors** | Full design token palette configured under `:root` for dark luxury aesthetics. | &check; |
| **Real Use of Flexbox** | Navigation bar, brand lockup, hero buttons, metrics proof bar, filter pills, form rows, footer. | &check; |
| **Real Use of Grid** | 12-column centerpiece gallery with wide/tall editorial spans, 2-column about card, booking form split. | &check; |
| **`object-fit: cover` Centerpiece** | Applied to every gallery image (`.gallery-image`) and photographer portrait (`.about-portrait`). | &check; |
| **Short About Section** | Concise 2-paragraph artist statement with quick specs grid and accolades. | &check; |
| **Swapped Shop for Booking** | Replaced e-commerce button with a high-conversion "Book a Shoot" form & consultation card. | &check; |
| **Zero Horizontal Scroll** | Guaranteed responsive containers (`max-width: 100%`, `overflow-x: hidden`, flexible grids). | &check; |

---

## Key Features & Architecture

### 1. Centerpiece Image Gallery Grid (`object-fit: cover`)
The centerpiece is a responsive CSS Grid with varied visual rhythms (wide landscape spans, tall portrait spans, and standard plates):
```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.75rem;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
```
Each artwork is wrapped in semantic `<article>` and `<figure>` tags, complete with accessible `alt` descriptions and an overlay `<figcaption>` revealing technical camera specs, series name, and location.

### 2. Pure CSS Lightbox Modals (`:target`)
Without a single line of JavaScript, users can click any photo in the gallery to open a full-resolution modal preview containing technical capture notes, camera equipment specs, and booking inquiries:
```css
.lightbox-modal {
  display: none;
}
.lightbox-modal:target {
  display: flex;
}
```

### 3. Pure CSS Mobile Navigation (Checkbox Hack)
On mobile devices (&le; 768px), navigation collapses into an animated accessible hamburger menu powered entirely through CSS without script dependencies:
```css
.nav-toggle-input:checked ~ .site-nav {
  display: block;
}
```

### 4. Interactive "Book a Shoot" Form
Swapping out generic shop buttons, the booking section provides a comprehensive client intake form:
- Radio pill selectors for shoot category (Editorial, Architecture, Fine Art Portrait, Print Acquisition)
- Preferred shoot timeframe and location
- Estimated budget bracket dropdown
- Creative vision & moodboard textarea
- Direct studio contact coordinates (Berlin & Paris) and 24-hour response pledge
- Pure CSS submission feedback confirmation state via `#book-success` target

---

## Project Structure

```text
photography-portfolio/
├── .gitignore
├── README.md
├── index.html              # Single-page HTML5 semantic structure
├── style.css               # Design tokens, Flexbox, CSS Grid & responsive layout
└── assets/
    └── images/
        ├── architecture-minimal.jpg   # Monolith in Ochre (Valencia)
        ├── botanical-fineart.jpg      # Organic Flora III
        ├── editorial-portrait.jpg     # Luminescence IV (Vogue Italia)
        ├── golden-landscape.jpg       # Golden Solitude (Dolomites)
        ├── interior-light.jpg         # Sanctuary Rays (Copenhagen)
        ├── ocean-aerial.jpg           # Aegean Textures (Milos)
        ├── photographer-bio.jpg       # Elena Vance Artist Portrait
        ├── street-noir.jpg            # Neon Shadows (Tokyo)
        └── studio-portrait.jpg        # Nocturne Profile (Paris)
```

---

## How to View Locally

Because this project uses 100% plain HTML5 and CSS3 with no external dependencies or build tools:

1. **Direct File Open**:
   Double click `index.html` or open it directly in any modern browser (Chrome, Firefox, Safari, Edge).

2. **Local HTTP Server** (Recommended for web standards):
   Run any static web server in the project directory:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`.

---

## License & Credits
- **Photographic Works**: Curated editorial demonstrations for AURA Studio.
- **Design & Code**: Plain HTML5/CSS3 implementation adhering to modern W3C semantics.
