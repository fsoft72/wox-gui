# CHANGES.md

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
