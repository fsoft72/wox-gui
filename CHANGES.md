# CHANGES.md

## 2026-03-05 — Data grid component

### Added
- **`<wox-datagrid>`** (`src/wox-datagrid.js`): New sortable data grid with resizable columns, row hover, odd/even row striping. Columns and rows set via JS properties. Emits `wox-sort` and `wox-row-click` events. Supports column alignment, sortable toggle, and smart numeric/string sorting.
- Added to barrel export (`src/index.js`)
- Demo sections in `demo/catalog.html` and `demo/showcase.html`
- Documentation at `docs/wox-datagrid.md`, linked from `docs/index.md`

## 2026-03-05 — Comprehensive documentation

### Added
- **Documentation** (`docs/`): 24 Markdown files covering every component in the library:
  - `index.md` — Component index with links to all docs
  - `getting-started.md` — Setup, fonts, imports, minimal example, project structure
  - `theming.md` — All CSS custom properties (colors, spacing, radius, typography, shadows, transitions, z-index)
  - Individual docs for all 21 components: `wox-icon`, `wox-separator`, `wox-badge`, `wox-button`, `wox-input`, `wox-slider`, `wox-color-swatch`, `wox-tooltip`, `wox-color-picker`, `wox-menu-item`, `wox-menu`, `wox-layer-item`, `wox-section`, `wox-tab`, `wox-tabs`, `wox-toolbar-group`, `wox-toolbar`, `wox-panel`, `wox-menubar`, `wox-statusbar`, `wox-modal`
  - Each component doc details all properties, events, slots, features, and code examples

## 2026-03-05 — Glow buttons & super showcase

### Added
- **Glow button support** (`src/wox-button.js`): New `glow` attribute and `color` attribute for tile variant. When `glow` is set, tiles render with animated neon box-shadow, text-shadow, and SVG drop-shadow using the specified color. Hover-only color accent also supported via `color` without `glow`. Animated via `glow-pulse` keyframes.
- **Super Showcase demo** (`demo/showcase.html`): Comprehensive page with:
  - Glow button gallery (active glow, hover-only, Material Icons glow)
  - Full icon zoo and badge collection
  - All button variants with tooltips
  - Input/slider grid with 8 fields and 4 sliders
  - Color palette (16 colors), alpha swatches, and color picker integration
  - Full menubar with 5 menus and keyboard shortcuts
  - Toolbar + canvas mockup layout
  - Deep nested layers panel (3 levels)
  - UI patterns: pill toggles, progress bars, stat cards, notification banners, kbd tags
  - Two modal dialogs (delete confirm, export settings with form)
  - Right panel: exact replica of the VectorWebGPU Properties/Layers panel with tabs, sections, field grid, swatches, dash buttons, opacity slider, action tiles, and path operations with clickable glow toggle
- Updated `index.html` to link the Super Showcase page.

## 2026-03-05 — Initial implementation

### Added
- **Theme system** (`css/wox-theme.css`): 70+ CSS custom properties for colors, spacing, radii, fonts, z-index layers, shadows, and transitions. All prefixed `--wox-`.
- **Base class** (`src/wox-base.js`): `WoxElement` extending `HTMLElement` with shadow root setup, `render()`, `emit()`, `$()`, `$$()` helpers, and shared reset styles.
- **21 web components** in `src/`:
  - **Primitives**: `wox-icon`, `wox-separator`, `wox-badge`, `wox-button` (icon/text/tile/dash variants), `wox-input` (text/number with unit suffix + drag scrubbing), `wox-slider` (custom track/thumb/fill), `wox-color-swatch` (alpha checkerboard), `wox-tooltip`
  - **Composites**: `wox-color-picker` (HSV wheel + alpha + hex, ported from colorpicker.js), `wox-menu-item` (item/separator/header types), `wox-menu` (dropdown with viewport flip), `wox-layer-item` (name, eye, lock, double-click rename)
  - **Layout**: `wox-section` (collapsible), `wox-tab`, `wox-tabs` (header auto-generation), `wox-toolbar-group`, `wox-toolbar`, `wox-panel` (resizable), `wox-menubar` (keyboard nav), `wox-statusbar` (3-column), `wox-modal` (backdrop blur, escape, focus)
- **Barrel file** (`src/index.js`): imports and re-exports all components.
- **Demo pages**:
  - `demo/catalog.html` — Component showcase with all states and event logging
  - `demo/editor.html` — Full 3-column editor layout replicating VectorWebGPU structure
- **Landing page** (`index.html`): links to both demos.
