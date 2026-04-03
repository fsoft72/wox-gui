# CHANGES.md

## 2026-04-03 — fix: thick button borders when theme CSS not loaded

### Fixed
- **`demo/catalog.html`**: Added missing `<link rel="stylesheet" href="../css/wox-theme.css">`. Without the theme, CSS custom properties were undefined causing buttons to render with browser-default 3px borders.
- **`src/wox-button.js`**: Added final `#333` fallback to nested `var()` in base button border: `var(--wox-btn-border, var(--wox-border, #333))`. Prevents "invalid at computed-value time" when both custom properties are undefined.

## 2026-04-03 — wox-input: support all standard input types

### Added
- **`src/wox-input.js`**: Support for all standard HTML input types: `password`, `email`, `url`, `tel`, `search`, `color`, `date`, `time`, `datetime-local`, `range` (in addition to existing `text` and `number`).
  - `color` type renders a native color picker with dark-theme styling.
  - `date`, `time`, `datetime-local` use `color-scheme: dark` for native picker integration.
  - `range` type renders a native range slider with accent color.
  - `number` and `range` share numeric handling (`parseFloat`, `min`/`max`/`step`).
  - Invalid type values fall back to `"text"`.
- **`demo/catalog.html`**: Added demo rows for password, email, url, tel, search, color, date, time, datetime-local, and range inputs.

### Changed
- **`docs/wox-input.md`**: Updated with supported types table, new examples, and notes.
- **`llms.md`**: Updated wox-input section with new types list, attributes, and examples.

## 2026-03-29 — wox-button: border-style attribute

### Added
- **`src/wox-button.js`**: `border-style` attribute — sets CSS border-style (`solid`, `dashed`, `dotted`, `double`, etc.) on all variants.
- **`demo/catalog.html`**: Added "Border style" and "Style + color" demo rows to the Button section.
- **`llms.md`**: Added `border-style` to attribute table and code examples.

## 2026-03-29 — wox-button: border-color / icon-color / text-color; wox-menu: clickable title

### Added
- **`src/wox-button.js`**: Three new attributes for all variants:
  - `border-color` — custom border color, persists across default/hover/active states
  - `icon-color` — custom color for the Material Icons element only
  - `text-color` — custom text/label color; also controls `dash-line` fill in the `dash` variant
- **`src/wox-menu.js`**: When the menu has no children, clicking the trigger emits `wox-click { label }` instead of opening an empty dropdown.

### Changed
- **`demo/catalog.html`**: Added "Border color", "Icon color", "Text color", and "Combined" demo rows to the Button section.
- **`llms.md`**: Updated `wox-button` attribute table and `wox-menu` event table.

## 2026-03-21 — Track demo/catalog.html version in bump script

### Fixed
- **`scripts/version.sh`**: Now updates `v{VERSION}` in `demo/catalog.html` (About modal) during version bumps.
- **`scripts/publish.sh`**: Stages `demo/catalog.html` in the release commit.

## 2026-03-21 — Include site in version bumps

### Fixed
- **`site/index.html`**: Updated stale version from `0.1.4` to `0.1.5` (CDN URL and footer).
- **`scripts/version.sh`**: Now also updates `site/index.html` (both CDN URL and footer `vX.Y.Z`).
- **`scripts/publish.sh`**: Stages `site/index.html` in the release commit.

## 2026-03-21 — Extract version bump script

### Added
- **`scripts/version.sh`**: Standalone script to bump version and update all version references (`package.json`, `AGENT.md`, `tests/cdn.html`, `llms.md`) without publishing.

### Changed
- **`scripts/publish.sh`**: Now delegates version bumping to `scripts/version.sh` instead of duplicating the logic.

## 2026-03-21 — Fix CDN window globals stripped by terser

### Fixed
- **`src/cdn.js`**: Replaced `Object.assign(window, {...})` with individual `window.X = X` assignments. Terser's `compress` was stripping the `Object.assign` call as dead code, so the built CDN bundle had no window globals despite the source code intending to set them.
- **`package.json`**: Added `./dist/wox-gui.cdn.js` to `sideEffects` to prevent bundlers from tree-shaking the CDN entry point.

## 2026-03-20 — CDN global exposure and publish --force

### Fixed
- **`src/cdn.js`**: All component classes are now exposed on `window` after CDN script loads. Previously `WoxToast`, `WoxContextMenu`, and all other classes were only available via ES module `import` — using them as globals (e.g. `WoxToast.success(...)`) would fail with `undefined`.

### Added
- **`scripts/publish.sh`**: Added `--force` flag to skip the clean working tree check.
- **`tests/cdn.html`**: Added checks verifying `window.WoxToast` and `window.WoxContextMenu` are available as globals.

## 2026-03-20 — LLM documentation file

### Added
- **`llms.md`**: Single consolidated documentation file for LLM consumption, covering all 28 components, theming, and setup.
- **`scripts/build-site.sh`**: Copies `llms.md` to `dist-site/` during site build so it's served at `/wox-gui/llms.md`.

### Updated
- **`llms.md`**: Added CDN usage instructions (`jsdelivr.net`) to the Setup section.
- **`scripts/publish.sh`**: Version bump now also updates CDN URL in `llms.md`.

## 2026-03-20 — Documentation audit and fixes

### Added
- **`docs/wox-date-picker.md`**: Full documentation for the `<wox-date-picker>` component (attributes, events, JS API, examples).

### Fixed
- **`docs/theming.md`**: Corrected font size variable names — `--wox-font-xs` → `--wox-font-size-xs` (all 7 entries plus example).
- **`docs/wox-layer-item.md`**: Fixed icon names for `ellipse` (`circle` → `radio_button_unchecked`) and `text` (`title` → `text_fields`).
- **`docs/wox-separator.md`**: Fixed `spacing` default value (`—` → `"0"`) and clarified direction-dependent margin behavior.
- **`docs/wox-button.md`**: Fixed `dash` default value (`—` → `"solid"`).
- **`docs/index.md`**: Added missing `<wox-select>` and `<wox-date-picker>` to component index; updated count to 28.
- **`docs/getting-started.md`**: Added missing source files to project structure listing.

## 2026-03-20 — GitHub Pages showcase site

### Added
- **`site/index.html`**: Landing page with hero, feature grid, getting started guide, and live demo links.
- **`site/assets/site.css`**: Dark-themed styles for the landing page with responsive breakpoints.
- **`vite.config.site.js`**: Vite config for building the site to `dist-site/` with base path `/wox-gui/`.
- **`scripts/build-site.sh`**: Build script that compiles the site, copies CDN bundle and demo pages, and patches demo imports.
- **`.github/workflows/deploy-site.yml`**: GitHub Actions workflow to build and deploy to GitHub Pages on push to master.
- **`build:site`** npm script: runs library build then site build in one command.

## 2026-03-20 — MIT License

### Added
- **`LICENSE`**: MIT license file. Copyright OS3 srl, authors Fabio Rotondo and Andrea Rotondo.

## 2026-03-20 — Build minification

### Added
- **`@rollup/plugin-terser`** dev dependency for production JS minification.

### Changed
- **`vite.config.js`** and **`vite.config.cdn.js`**: Added `@rollup/plugin-terser` as a rollup output plugin to remove all JS comments and compact output (~21% size reduction).

## 2026-03-19 — Light mode support

Complete light theme for the entire component library, activated via `data-wox-theme="light"` on `<html>`.

### Added
- **Light theme CSS variables** (`css/wox-theme.css`): 23 CSS variable overrides under `:root[data-wox-theme="light"]` covering backgrounds, text, accent, borders, semantic colors, and shadows.
- **`WoxTheme` utility** (`src/wox-theme.js`): Static class with `get()`, `set()`, `toggle()`, and `auto()` methods. Manages the `data-wox-theme` attribute, persists to `localStorage`, and dispatches `wox-theme-change` events.
- **`<wox-theme-toggle>`** (`src/wox-theme-toggle.js`): Sun/moon icon button that calls `WoxTheme.toggle()`. Supports `auto` attribute for OS `prefers-color-scheme` detection. Listens for `wox-theme-change` to keep icon in sync.
- **Light-mode toast palette** (`src/wox-toast.js`): `TYPE_PALETTE_LIGHT` constant with light-appropriate colours for success, error, warning, and info toasts. `_getPalette()` helper selects the correct palette based on active theme.
- **Documentation**: `docs/theming.md` Light Mode section, `docs/wox-theme-toggle.md`, updated `docs/index.md`.
- **Demo pages**: Added `<wox-theme-toggle>` to `demo/showcase.html` and `demo/catalog.html`.
- **CDN test**: Added `<wox-theme-toggle>` to `tests/cdn.html` and updated expected element count to 29.

### Changed
- **Hardcoded colors replaced with CSS variables** across ~10 components: `wox-button`, `wox-input`, `wox-slider`, `wox-color-picker`, `wox-menu-item`, `wox-menu`, `wox-menubar`, `wox-layer-item`, `wox-tabs`, `wox-datagrid`, and `wox-section`. All hardcoded hex colours (`#fff`, `#000`, `#1e1e22`, `#333`, etc.) replaced with the appropriate `--wox-*` variable so they adapt to both themes.
- **`src/index.js`**: Added barrel exports for `WoxTheme` and `WoxThemeToggle`.
- **`src/register.js`**: Registers `wox-theme-toggle` custom element.
- **`src/cdn.js`**: Exports `WoxTheme` and `WoxThemeToggle`, registers the toggle element, includes light theme CSS in the injected stylesheet.

## 2026-03-09 — Add CDN test page

### Added
- **`tests/cdn.html`**: Test page for the CDN bundle. Loads only `dist/wox-gui.cdn.js` (no theme `<link>`, no `register.js`). Runs automated checks (theme injection, CSS variable resolution, all 28 custom elements registered, shadow DOM presence, no duplicate injection). Exercises icons, buttons, badges, inputs, slider, select, color swatches, tooltips, section, tabs, modal, toasts, date picker, datagrid, and context menu with an event log.

## 2026-03-09 — Add CDN bundle entry point

### Added
- **`src/cdn.js`**: Single-file CDN entry point that imports `register.js` (registers all components) and injects the theme CSS custom properties into the document head via a `<style id="wox-theme">` element. Idempotent — skips injection if the style element already exists.

### Changed
- **`vite.config.js`**: Added `wox-gui.cdn` as a third library entry point.
- **`package.json`**: Added `"./cdn"` sub-path export pointing to `dist/wox-gui.cdn.js`.
- **`AGENT.md`**: Documented CDN usage with jsdelivr and unpkg URLs.

## 2026-03-09 — Add AGENT.md

### Added
- **`AGENT.md`**: Comprehensive project guide for LLMs — covers architecture, component inventory, theming system, coding conventions, event patterns, and step-by-step instructions for adding new components.

## 2026-03-07 — Add npm publish script

### Added
- **`scripts/publish.sh`**: Bash script to publish wox-gui to npm. Checks clean working tree, verifies npm auth, runs `pnpm build`, bumps version (patch/minor/major or explicit), publishes with `--access public`, then commits and tags the release.

## 2026-03-07 — npm package setup with Vite library mode

### Added
- **`package.json`**: Project manifest with ESM exports, `"wox-gui/register"` and `"wox-gui/theme"` sub-path exports, `sideEffects` field for tree-shaking, `build`/`dev`/`preview` scripts.
- **`vite.config.js`**: Vite library mode with two entry points (`index.js` and `register.js`), ESM-only output.
- **`src/register.js`**: Convenience entry that imports all components and calls `customElements.define()` for each.

### Changed
- **`src/wox-*.js`**: Removed `customElements.define()` calls from all 28 component files — classes are now pure exports for tree-shaking.
- **`src/index.js`**: Unchanged — remains a side-effect-free barrel re-export.
- **`demo/*.html`**: Updated script imports from `src/index.js` to `src/register.js`.
- **`.gitignore`**: Added `node_modules` and `dist`.

## 2026-03-06 — Refresh input, datagrid, and modal demos

### Changed
- **`demo/catalog.html`**: Added an inline-unit input example with programmatic `value` updates, updated the modal demo to use `open()` / `openState`, added a `closable="false"` example, and expanded the datagrid demo to show reorderable columns and inline editing.
- **`demo/showcase.html`**: Added compact unit-suffix input examples, updated the datagrid copy and sample data for inline editing and column reordering, added a live `wox-cell-change` status message, and updated modal triggers to use the public API plus a no-close-button example.
- **`demo/editor.html`**: Updated the unlabeled stroke-width input to use the inline unit suffix layout.

## 2026-03-06 — Correct wox-modal documentation

### Changed
- **`docs/wox-modal.md`**: Updated the docs to match the current implementation. Clarified that `closable="false"` hides only the close button, Escape and backdrop clicks still dismiss the modal, and documented the public `open()`, `close()`, and `openState` API.

## 2026-03-06 — Correct wox-datagrid documentation

### Changed
- **`docs/wox-datagrid.md`**: Added the undocumented `editable` column flag, `wox-cell-change` event, inline-edit behavior, and column drag-reordering details. Also documented that reordering preserves widths and that cell values are rendered directly into the template.
- **`docs/index.md`**: Updated the datagrid summary to mention reorderable columns and inline editing.

## 2026-03-06 — Correct wox-input documentation

### Changed
- **`docs/wox-input.md`**: Documented the public `value` property, clarified how units render with and without labels, and noted that numeric events emit parsed numbers and can produce `NaN` for empty or invalid values.

## 2026-03-06 — Add vertical tab placement to wox-tabs

### Added
- **`<wox-tabs placement>`**: New `placement` attribute supporting `top` (default), `left`, and `right` values. Vertical placements render tab headers as a sidebar with rotated text labels. Left tabs read bottom-to-top, right tabs read top-to-bottom. Active indicator line faces the content area.

## 2026-03-06 — Add wox-date-picker component

### Added
- **`<wox-date-picker>`**: New component ported from DateSelectorElement (liwe3-webcomponents). Calendar date picker with single and range selection modes. Month navigation (prev/next) and year dropdown (±10 years). Range hover preview via DOM class manipulation (no re-render). "Today" button navigates to current month and selects today (or starts range from today). Clicking other-month cells navigates to that month. Uses `wox-change` event with `detail: { date }` (single) or `detail: { start, end }` (range). Attributes: `range-mode`, `value`, `range-start`, `range-end`, `disabled`. Public API: `setDate()`, `setRange()`, `getSelectedDate()`, `getSelectedRange()`, `clear()`.

## 2026-03-06 — Add wox-select component

### Added
- **`<wox-select>`**: New component ported from SmartSelectElement (liwe3-webcomponents). Searchable dropdown with single/multi-select, keyboard navigation (arrows, enter, escape), viewport-aware positioning (opens upward when near bottom edge), and per-option avatar images. Uses `wox-*` events (`wox-change`, `wox-open`, `wox-close`, `wox-search`).

## 2026-03-06 — Fix five bugs in wox-select

### Fixed
- **Memory leak (Fix 1)**: Shadow root `click`, `mouseover`, and `input` listeners were re-added on every `_render()` call, causing unbounded listener accumulation. Moved them to `connectedCallback()` as named bound references and removed them in `disconnectedCallback()`. The `mouseleave` handler for clearing focused options is now attached directly to the recreated dropdown element inside `_render()`.
- **XSS (Fix 2)**: Added module-level `_esc()` helper that escapes `&`, `<`, `>`, and `"`. All user-supplied values (`o.label`, `o.value`, `o.image`, `this.placeholder`, `this._searchValue`) are now escaped in the HTML template strings inside `_render()`. `dataset.value` correctly returns the unescaped string so `selectOption`/`deselectOption` receive correct values.
- **Stale selection after options change (Fix 3)**: `attributeChangedCallback` now filters `_selectedOptions` to only retain entries whose value still exists in the new options list, preventing ghost selections.
- **Double render in `setOptions()` (Fix 4)**: Removed the redundant direct `_render()` call at the end of `setOptions()`. The attribute assignment via `setAttribute` already triggers `attributeChangedCallback` → `_render()`. Removed use of the `options` property setter to avoid a second `_parsedOptions = null` reset.
- **Inconsistent `_filteredOptions` reset (Fix 5)**: Removed `options.length > 0` guards from `open()` and `close()`. `_filteredOptions` is now always reset unconditionally, including when the options list is empty.

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
