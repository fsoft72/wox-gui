# CHANGES.md

## 2026-03-05 — Fix menu dropdown clipped by container overflow

### Fixed
- **`<wox-menu>`**: Switched dropdown from `position: absolute` to `position: fixed` with dynamic positioning via `getBoundingClientRect()`. Menus no longer get clipped by parent containers with `overflow: hidden/auto`. Auto-flips horizontally and vertically when near viewport edges.

## 2026-03-05 — Expand glow/pulse FX to icon, slider, swatch, modal

### Added
- **`<wox-icon>`**: New `color`, `glow`, `pulse` attributes — neon glow and opacity pulse effects with custom color.
- **`<wox-slider>`**: New `color`, `glow`, `pulse` attributes — custom accent color for fill track, neon glow on thumb, opacity pulse.
- **`<wox-color-swatch>`**: New `glow`, `pulse` attributes — glow uses the swatch's own color automatically.
- **`<wox-modal>`**: New `color`, `glow`, `pulse` attributes — neon glow border on dialog box.
- Showcase examples for all 4 components with glow, pulse, and combined effects.
- Documentation updates for all 4 components.

## 2026-03-05 — Extract glow/pulse FX into shared module

### Added
- **`src/wox-fx.js`**: New shared module exporting `FX_STYLES` — glow and pulse CSS effects using `--wox-fx-color` variable. Any WOX component can import and append these styles to gain `.glow` and `.pulse` class support.
- Exported `FX_STYLES` from barrel file (`src/index.js`)

### Changed
- **`<wox-button>`**: Glow/pulse CSS extracted into `wox-fx.js`. Internal variable renamed from `--btn-color` to `--wox-fx-color` for consistency with the shared module. No API changes — `glow`, `pulse`, and `color` attributes work exactly as before.

## 2026-03-05 — Pulse style, input alignment, tooltip & dropdown fixes

### Added
- **`<wox-button>`**: New `pulse` boolean attribute — opacity pulse animation (1.0 to 0.4, 1.5s cycle). Works standalone or combined with `glow` for glow+pulse effect.
- Pulse examples added to `demo/showcase.html` (standalone, combined with glow)

### Fixed
- **`<wox-input>`**: Numeric inputs now right-align text
- **`<wox-tooltip>`**: Switched to `position: fixed` with viewport-aware positioning — tooltips no longer get clipped by container overflow. Preferred placement is respected but auto-flips when near edges.
- **`<wox-gradient-selector>`**: Dropdown switched to `position: fixed` with dynamic positioning — no longer clipped by parent containers. Auto-flips above trigger when insufficient space below.

## 2026-03-05 — Toast, Context Menu & Gradient components

### Added
- **`<wox-toast>`** (`src/wox-toast.js`): Toast notification system ported from wow3. Static API: `WoxToast.success/error/warning/info(message, options)`. Supports 4 types, 6 positions (TL/TC/TR/BL/BC/BR), auto-dismiss with progress bar, pause-on-hover, duplicate deduplication, slide+collapse animations. Dark-themed with `--wox-*` variables.
- **`<wox-context-menu>`** (`src/wox-context-menu.js`): Right-click context menu ported from wow3. Static API: `WoxContextMenu.show(event, items)`. Supports labels, icons, shortcuts, dividers, disabled states. Singleton pattern, viewport clamping, Escape/outside-click to close.
- **`<wox-gradient-editor>`** (`src/wox-gradient-editor.js`): Interactive gradient stop bar ported from wow3. Set gradient via JS property. Drag handles to reposition, double-click to add stops, drag 40px down to remove. Emits `wox-gradient-input` and `wox-gradient-change` events. Exports `gradientToCSS()` and `cssToGradient()` utility functions.
- **`<wox-gradient-selector>`** (`src/wox-gradient-selector.js`): Full gradient picker ported from wow3. Dropdown with 6 built-in presets, solid color option, custom gradient editor dialog (via `<wox-modal>`). Type toggle (linear/radial), angle and speed sliders (via `<wox-slider>`), animation type selector. localStorage persistence for user-created gradients. Emits `wox-gradient-change`.
- Added all 4 components to barrel export (`src/index.js`)
- Demo sections in `demo/catalog.html` and `demo/showcase.html`
- Documentation for all 4 components in `docs/`, updated `docs/index.md` (25 components)

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
