# AURA — Fine Art, Architectural & Editorial Photography Portfolio

A responsive single-page photography and art portfolio built for visual artist **Mohammed Kotbi**, rebuilt with **React + Tailwind CSS** (Vite) on the `react/tailwind` branch.

---

## Week 2 React + Tailwind Rebuild Overview

This branch rebuilds the Assignment 1 portfolio into an interactive React + Tailwind application while strictly preserving the business type, original content, warm editorial aesthetic, and semantic structure.

### Project Architecture & Key Requirements

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Vite + React Scaffold** | Scaffolded inside the existing repository using Vite, React 18, and PostCSS / Tailwind CSS. | ✓ |
| **Componentized Structure** | Broken down cleanly into `Header`, `Hero`, `MainContent` (with `GalleryItem`, `ArtworkModal`, `AboutSection`, `ServicesSection`, `BookingSection`), and `Footer`. | ✓ |
| **Single Data File** | All portfolio items and service packages stored in `src/data/items.js` as an array of structured objects. | ✓ |
| **Tailwind Fully Wired In** | Custom color tokens (`aura-base`, `aura-accent`, `aura-primary`, etc.) and typography configured in `tailwind.config.js`; legacy `style.css` removed. | ✓ |
| **Main Grid Filter with `useState`** | Live category filter pills (`All Works`, `Editorial & Fashion`, `Architecture`, `Atmosphere & Nature`, `Studio Mono`) powered by `useState`. | ✓ |
| **Controlled Component (`QuantityStepper`)** | Reusable `QuantityStepper` component implemented following the controlled component pattern (accepts `value` and `onChange`, parent manages state). | ✓ |
| **Mobile-First Responsive Design** | Rewritten with mobile-first Tailwind utilities (`unprefixed` base → `sm:` → `md:` → `lg:`). | ✓ |
| **Zero Horizontal Scroll** | Tested across mobile, tablet, and desktop viewports (`overflow-x: hidden`, bounded containers). | ✓ |
| **Atomic Git Commits** | Built iteratively with small, descriptive commits as each milestone was completed. | ✓ |
| **Pure JS / No Extra Libraries** | Pure JavaScript JSX, standard React + Tailwind CSS only, zero third-party UI bloat. | ✓ |

---

## Assessment Guide: How `useState` and the Controlled Component Work

### 1. The Category Filter (`useState`)
In `src/components/MainContent.jsx`:
```javascript
const [activeCategory, setActiveCategory] = useState('All Works');

const filteredItems = activeCategory === 'All Works'
  ? GALLERY_ITEMS
  : GALLERY_ITEMS.filter((item) => item.filterCategory === activeCategory);
```
- **How it works:**
  1. `activeCategory` holds the current string identifier of the selected filter (initial value: `'All Works'`).
  2. When a user clicks a category pill button, `onClick={() => setActiveCategory(category)}` calls the setter function.
  3. React schedules a re-render of `MainContent`.
  4. During re-render, `filteredItems` recalculates by matching each item's `filterCategory` with the new `activeCategory`.
  5. The gallery grid maps over `filteredItems`, displaying only the matching artwork cards.

### 2. The Controlled Component (`QuantityStepper`)
In `src/components/QuantityStepper.jsx`:
```javascript
export default function QuantityStepper({ value = 0, onChange, min = 0, max = 10, label }) {
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (value > min && onChange) onChange(value - 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (value < max && onChange) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center ...">
      <button onClick={handleDecrement} disabled={value <= min}>−</button>
      <span>{value}</span>
      <button onClick={handleIncrement} disabled={value >= max}>+</button>
    </div>
  );
}
```
- **Why it is "Controlled":**
  - `QuantityStepper` holds **zero internal state**. It does not call `useState` for its count.
  - The parent component (`MainContent`) owns the state dictionary: `const [printOrders, setPrintOrders] = useState({})`.
  - The parent passes down the current count via the `value` prop: `value={printOrders[item.id] || 0}`.
  - When the user clicks `+` or `−`, the stepper executes `onChange(value ± 1)`.
  - The parent's `handleQuantityChange` receives the new value, updates `printOrders` in state, and triggers a re-render where the new count flows right back into the stepper.
  - This guarantees a single source of truth and allows `MainContent` to automatically calculate the total prints ordered and order total across all cards.

---

## Development & Build Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production bundle
npm run preview
```

---

## Project Structure

```text
├── public/
│   └── assets/images/        # High-resolution artwork and photography assets
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Semantic header with responsive mobile hamburger toggle
│   │   ├── Hero.jsx          # Hero section with typography, CTAs, and metrics bar
│   │   ├── MainContent.jsx   # Orchestrates category filter, print orders, and grid
│   │   ├── GalleryItem.jsx   # Individual artwork card using QuantityStepper
│   │   ├── QuantityStepper.jsx # Controlled stepper component (value + onChange)
│   │   ├── ArtworkModal.jsx  # Detail preview modal showing camera specs
│   │   ├── AboutSection.jsx  # Artist bio, studio info, and accolades
│   │   ├── ServicesSection.jsx # Rates and photography commission packages
│   │   ├── BookingSection.jsx # Interactive shoot inquiry booking form
│   │   └── Footer.jsx        # Semantic footer, links, and back-to-top button
│   ├── data/
│   │   └── items.js          # Hardcoded data (GALLERY_ITEMS, CATEGORIES, SERVICES)
│   ├── App.jsx               # Root component assembling Header, Hero, Main, Footer
│   ├── index.css             # Tailwind base directives and font declarations
│   └── main.jsx              # React DOM entry point
├── index.html                # Single-page HTML shell with Google Fonts & root div
├── package.json
├── postcss.config.js
├── tailwind.config.js        # Theme extensions (colors, fonts, radii, shadows)
└── vite.config.js
```