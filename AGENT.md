# AGENT.md — WOX-GUI Project Guide for LLMs

## Overview

**WOX-GUI** is a dark-themed Web Component UI library written in vanilla JavaScript (ES modules). It was originally extracted from VectorWebGPU — a vector graphics editor. The library provides 28 custom elements for building desktop-style application UIs (toolbars, panels, menus, data grids, color pickers, etc.).

- **Zero dependencies** — no frameworks, no build step required for development
- **Shadow DOM** — every component uses an open shadow root for style encapsulation
- **Dark theme only** — themed via 70+ CSS custom properties (`--wox-*`)
- **npm package**: `wox-gui` (ESM-only, tree-shakable)

## Tech Stack

| Concern | Technology |
|---------|-----------|
| Language | Vanilla JavaScript (ES modules) |
| Components | Web Components (Custom Elements v1 + Shadow DOM) |
| Styling | CSS custom properties, scoped styles inside shadow roots |
| Build | Vite (library mode, ESM output) |
| Package manager | pnpm |
| Fonts | Inter (UI text), Material Icons (iconography) — loaded from Google Fonts CDN |

## Project Structure

```
wox-gui/
├── css/
│   └── wox-theme.css          # Global CSS custom properties (dark theme)
├── src/
│   ├── wox-base.js            # WoxElement base class (extends HTMLElement)
│   ├── wox-fx.js              # Shared glow/pulse visual effects module
│   ├── index.js               # Barrel re-export (side-effect-free, for tree-shaking)
│   ├── register.js            # Calls customElements.define() for all components
│   └── wox-*.js               # Individual component files (one class per file)
├── demo/
│   ├── catalog.html           # Interactive component catalog
│   ├── showcase.html          # Comprehensive showcase with all patterns
│   └── editor.html            # Full 3-column editor layout demo
├── docs/
│   ├── index.md               # Component index with links
│   ├── getting-started.md     # Setup guide
│   ├── theming.md             # CSS custom properties reference
│   └── wox-*.md               # Per-component documentation
├── scripts/
│   └── publish.sh             # npm publish script (bump, build, tag)
├── vite.config.js             # Vite library mode config
├── package.json               # ESM package with sub-path exports
├── index.html                 # Landing page linking to demos
├── CHANGES.md                 # Progressive changelog
└── AGENT.md                   # This file
```

## Architecture

### Base Class — `WoxElement`

All components extend `WoxElement` (in `src/wox-base.js`), which extends `HTMLElement` and provides:

| Method / Property | Description |
|-------------------|-------------|
| `constructor()` | Calls `attachShadow({ mode: 'open' })` |
| `render(css, html)` | Sets `shadowRoot.innerHTML` from CSS + HTML template strings |
| `emit(name, detail)` | Dispatches a composed, bubbling `CustomEvent` |
| `$(selector)` | `shadowRoot.querySelector` shortcut |
| `$$(selector)` | `shadowRoot.querySelectorAll` shortcut |
| `static BASE_STYLES` | Common CSS reset applied inside every shadow root |

### Component Pattern

Every component follows this structure:

1. **Imports** `WoxElement` from `./wox-base.js`
2. **Defines** a `STYLES` constant with component-specific CSS
3. **Exports** a class extending `WoxElement`
4. **Uses** `static get observedAttributes()` for reactive attributes
5. **Renders** in `connectedCallback()` and/or `attributeChangedCallback()` via `this.render(STYLES, html)`
6. **Emits** events with `wox-` prefix (e.g., `wox-click`, `wox-change`, `wox-sort`)
7. **Does NOT** call `customElements.define()` — registration is done separately in `register.js`

### Two Entry Points

| Entry | Path | Purpose |
|-------|------|---------|
| Main | `src/index.js` | Side-effect-free barrel export — import individual classes for tree-shaking |
| Register | `src/register.js` | Imports all components and registers them via `customElements.define()` |

### npm Sub-path Exports

```js
import { WoxButton, WoxInput } from 'wox-gui';       // Tree-shakable imports
import 'wox-gui/register';                             // Auto-register all components
import 'wox-gui/theme';                                // CSS custom properties
```

## Component Inventory (28 components)

### Primitives
- `<wox-icon>` — Material Icons wrapper (`name`, `size`, `color`, `glow`, `pulse`)
- `<wox-separator>` — Horizontal/vertical divider
- `<wox-badge>` — Dot, diamond, text indicator badges
- `<wox-button>` — Multi-variant: `icon`, `text`, `tile`, `dash` — with optional `glow`, `pulse`, `color`
- `<wox-input>` — Text/number input with label, unit suffix, drag-scrubbing for numbers
- `<wox-select>` — Searchable dropdown, single/multi-select, keyboard navigation, avatars
- `<wox-slider>` — Range slider with label, value display, custom accent color
- `<wox-color-swatch>` — Clickable color square with alpha checkerboard
- `<wox-tooltip>` — Hover tooltip (top/bottom/left/right), viewport-aware

### Composite
- `<wox-color-picker>` — HSV wheel + alpha + hex input
- `<wox-menu-item>` — Menu entry: item, separator, or header types
- `<wox-menu>` — Dropdown menu (click/hover/context triggers), fixed positioning
- `<wox-layer-item>` — Layer row with visibility toggle, lock, double-click rename
- `<wox-gradient-editor>` — Interactive gradient stop bar (drag, add, remove stops)
- `<wox-gradient-selector>` — Full gradient picker with presets, type/angle/speed controls
- `<wox-context-menu>` — Static API: `WoxContextMenu.show(event, items)`
- `<wox-date-picker>` — Calendar with single/range selection, year dropdown, today button

### Layout
- `<wox-section>` — Collapsible panel section with header
- `<wox-tab>` — Tab panel (child of `wox-tabs`)
- `<wox-tabs>` — Tab container with auto-generated headers, `placement`: top/left/right
- `<wox-toolbar-group>` — Button group with label
- `<wox-toolbar>` — Vertical toolbar container
- `<wox-panel>` — Resizable side panel
- `<wox-menubar>` — Horizontal menu bar with keyboard navigation
- `<wox-statusbar>` — Three-column bottom status bar
- `<wox-modal>` — Dialog overlay with backdrop blur, escape, focus trap

### Data & Feedback
- `<wox-datagrid>` — Sortable grid with resizable/reorderable columns, inline editing
- `<wox-toast>` — Static API: `WoxToast.success/error/warning/info(message, options)`

### Shared Module
- `wox-fx.js` — Exports `FX_STYLES` CSS for glow/pulse effects (uses `--wox-fx-color`)

## Theming

All theming is done via CSS custom properties defined in `css/wox-theme.css` and applied on `:root`. Components inherit these variables through shadow DOM. Key variable groups:

| Group | Prefix | Examples |
|-------|--------|----------|
| Backgrounds | `--wox-bg-*` | `--wox-bg-app`, `--wox-bg-panel`, `--wox-bg-input` |
| Text | `--wox-text-*` | `--wox-text-primary`, `--wox-text-secondary` |
| Accent | `--wox-accent` | `#00e5ff` (cyan) |
| Borders | `--wox-border*` | `--wox-border`, `--wox-border-light` |
| Semantic | `--wox-danger`, `--wox-success` | Red/cyan |
| Spacing | `--wox-space-*` | xs(2px) through 2xl(24px) |
| Radius | `--wox-radius-*` | sm(3px) through round(50%) |
| Font sizes | `--wox-font-size-*` | xs(9px) through 2xl(16px) |
| Z-index | `--wox-z-*` | base(1), dropdown(1000), overlay(10000), modal(20000) |
| Shadows | `--wox-shadow-*` | sm, md, lg, xl, input, section, accent |
| Transitions | `--wox-transition-*` | fast(0.12s), normal(0.2s), smooth(0.25s) |

## Event Conventions

- All custom events use the `wox-` prefix: `wox-click`, `wox-change`, `wox-sort`, `wox-open`, `wox-close`, etc.
- Events are dispatched with `{ bubbles: true, composed: true }`, crossing shadow DOM boundaries
- Event payload is in `event.detail`

## Development

```bash
pnpm install          # Install dev dependencies (just Vite)
pnpm dev              # Start Vite dev server
pnpm build            # Build library (ESM output in dist/)
```

The dev server serves `index.html` which links to the three demo pages. No transpilation — source files are plain JS served directly.

## Coding Conventions

- **One component per file**, named `wox-<name>.js`, exporting a single class `Wox<Name>`
- **No TypeScript** — plain JavaScript with JSDoc comments
- **No framework** — vanilla Web Components API only
- **CSS-in-JS via template strings** — each component defines a `STYLES` constant
- **Constants** in `UPPERCASE_WITH_UNDERSCORES`
- **Arrow functions** preferred: `const fn = () => {}`
- **Exit early** pattern: guard clauses at the top of functions
- **Comment all public methods** with JSDoc
- Components must NOT self-register — `customElements.define()` is only in `register.js`
- New components must be added to both `index.js` (barrel export) and `register.js`

## Documentation

Each component has a dedicated Markdown file in `docs/wox-<name>.md` covering:
- Tag name and description
- All attributes/properties with types and defaults
- Events with detail payloads
- Slots (if any)
- Code examples
- Feature notes

The `docs/index.md` serves as the component index. Update it when adding new components.

## Key Files to Modify When Adding a New Component

1. `src/wox-<name>.js` — Create the component class extending `WoxElement`
2. `src/index.js` — Add the export
3. `src/register.js` — Add the `customElements.define()` call
4. `docs/wox-<name>.md` — Write component documentation
5. `docs/index.md` — Add to the component table
6. `demo/catalog.html` — Add a demo section
7. `demo/showcase.html` — Add showcase examples
8. `CHANGES.md` — Document the addition
