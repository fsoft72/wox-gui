# WOX-GUI Component Library

A dark-themed Web Component library built with vanilla JavaScript, Shadow DOM, and CSS custom properties. Originally extracted from VectorWebGPU.

**21 components** | **Dark theme** | **Zero dependencies** | **No build step**

---

## Getting Started

- [Getting Started](./getting-started.md) -- Installation, setup, and basic usage
- [Theming](./theming.md) -- CSS custom properties, colors, spacing, and typography

---

## Components

### Primitives

| Component | Description |
|-----------|-------------|
| [wox-icon](./wox-icon.md) | Material Icons wrapper with size control |
| [wox-separator](./wox-separator.md) | Horizontal or vertical divider line |
| [wox-badge](./wox-badge.md) | Dot, diamond, and text indicator badges |
| [wox-button](./wox-button.md) | Multi-variant button (icon, text, tile, dash) with optional glow |
| [wox-input](./wox-input.md) | Text and number input with units and drag scrubbing |
| [wox-slider](./wox-slider.md) | Custom range slider with label and value display |
| [wox-color-swatch](./wox-color-swatch.md) | Clickable color preview square with alpha support |
| [wox-tooltip](./wox-tooltip.md) | Hover tooltip wrapper with 4 positions |

### Composite

| Component | Description |
|-----------|-------------|
| [wox-color-picker](./wox-color-picker.md) | HSV wheel color picker with alpha and hex input |
| [wox-menu-item](./wox-menu-item.md) | Menu entry with icon, shortcut, and submenu support |
| [wox-menu](./wox-menu.md) | Dropdown menu with click/hover/context triggers |
| [wox-layer-item](./wox-layer-item.md) | Layer panel row with visibility, lock, and rename |

### Layout

| Component | Description |
|-----------|-------------|
| [wox-section](./wox-section.md) | Collapsible panel section with header actions |
| [wox-tab](./wox-tab.md) | Individual tab panel (used inside wox-tabs) |
| [wox-tabs](./wox-tabs.md) | Tab container with auto-generated header buttons |
| [wox-toolbar-group](./wox-toolbar-group.md) | Toolbar button group with label |
| [wox-toolbar](./wox-toolbar.md) | Vertical toolbar container |
| [wox-panel](./wox-panel.md) | Resizable side panel |
| [wox-menubar](./wox-menubar.md) | Horizontal menu bar with keyboard navigation |
| [wox-statusbar](./wox-statusbar.md) | Three-column bottom status bar |
| [wox-modal](./wox-modal.md) | Dialog overlay with backdrop, escape key, and animations |

### Data

| Component | Description |
|-----------|-------------|
| [wox-datagrid](./wox-datagrid.md) | Sortable data grid with resizable columns and row selection |

---

## Architecture

All components extend `WoxElement`, a lightweight base class built on `HTMLElement`. Each component uses an open Shadow DOM for style encapsulation and renders via template strings. Events follow a `wox-*` naming convention and bubble through the DOM with `composed: true`.

### Base Class -- `WoxElement`

| Method | Description |
|--------|-------------|
| `render(css, html)` | Sets the shadow root innerHTML from CSS and HTML template strings |
| `emit(name, detail)` | Dispatches a composed, bubbling `CustomEvent` |
| `$(selector)` | `shadowRoot.querySelector` shortcut |
| `$$(selector)` | `shadowRoot.querySelectorAll` shortcut |

---

## Browser Support

WOX-GUI uses standard Web Component APIs (Custom Elements, Shadow DOM, CSS Custom Properties) and works in all modern browsers: Chrome, Firefox, Safari, and Edge.
