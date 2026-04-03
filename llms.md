# WOX-GUI — Complete LLM Reference

WOX-GUI is a zero-dependency, dark-themed Web Component library built with vanilla JavaScript, Shadow DOM, and CSS custom properties. 28 components. Dark and light themes. No build step required.

All components extend `WoxElement` (a lightweight `HTMLElement` base class with open Shadow DOM). Events follow a `wox-*` naming convention and bubble with `composed: true`.

---

## Setup

```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Theme -->
<link rel="stylesheet" href="css/wox-theme.css">

<!-- All components -->
<script type="module" src="src/index.js"></script>
```

Or use the CDN build (no install required):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/wox-gui@0.1.10/dist/wox-gui.cdn.js"></script>
```

The CDN build registers all custom elements, injects the theme, and exposes every class (e.g. `WoxToast`, `WoxContextMenu`, `WoxModal`, …) on `window` as globals — no `import` needed.

Or import selectively:

```js
import { WoxButton, WoxInput } from './src/index.js';
```

Boolean attributes (`active`, `disabled`, `open`) are toggled by presence/absence — value does not matter.

---

## Theming

All CSS custom properties are defined in `css/wox-theme.css`. Override at `:root` or scope to any ancestor element.

### Backgrounds

| Variable | Default | Usage |
|----------|---------|-------|
| `--wox-bg-app` | `#121214` | Main application background |
| `--wox-bg-panel` | `#17171a` | Panel backgrounds |
| `--wox-bg-toolbar` | `#1e1e22` | Toolbar and menubar background |
| `--wox-bg-input` | `#1a1a1d` | Input field background |
| `--wox-bg-hover` | `#2a2a2e` | Hover state background |
| `--wox-bg-canvas` | `#505050` | Canvas / content area |
| `--wox-bg-section-header` | `#22222a` | Section header background |

### Text

| Variable | Default | Usage |
|----------|---------|-------|
| `--wox-text-primary` | `#eee` | Default body text |
| `--wox-text-secondary` | `#999` | Secondary / disabled text |
| `--wox-text-hi` | `#fff` | Highlighted / emphasis text |

### Accent and Semantic

| Variable | Default | Usage |
|----------|---------|-------|
| `--wox-accent` | `#00e5ff` | Primary accent (cyan) |
| `--wox-danger` | `#f72585` | Danger / destructive actions |
| `--wox-success` | `#4cc9f0` | Success indicator |
| `--wox-unite` | `#4cc9f0` | Boolean unite operation |
| `--wox-subtract` | `#f72585` | Boolean subtract operation |
| `--wox-intersect` | `#4361ee` | Boolean intersect operation |
| `--wox-exclude` | `#7209b7` | Boolean exclude operation |

### Borders

| Variable | Default |
|----------|---------|
| `--wox-border` | `#333` |
| `--wox-border-light` | `#444` |
| `--wox-border-section` | `#2e2e2e` |

### Spacing (8px grid)

| Variable | Default |
|----------|---------|
| `--wox-space-xs` | `2px` |
| `--wox-space-sm` | `4px` |
| `--wox-space-md` | `8px` |
| `--wox-space-lg` | `12px` |
| `--wox-space-xl` | `16px` |
| `--wox-space-2xl` | `24px` |

### Border Radius

| Variable | Default |
|----------|---------|
| `--wox-radius-sm` | `3px` |
| `--wox-radius-md` | `6px` |
| `--wox-radius-lg` | `8px` |
| `--wox-radius-xl` | `10px` |
| `--wox-radius-2xl` | `12px` |
| `--wox-radius-round` | `50%` |

### Typography

| Variable | Default |
|----------|---------|
| `--wox-font` | `'Inter', 'Segoe UI', sans-serif` |
| `--wox-font-mono` | `'Courier New', monospace` |
| `--wox-font-size-xs` | `9px` |
| `--wox-font-size-sm` | `10px` |
| `--wox-font-size-md` | `11px` |
| `--wox-font-size-base` | `12px` |
| `--wox-font-size-lg` | `13px` |
| `--wox-font-size-xl` | `14px` |
| `--wox-font-size-2xl` | `16px` |

### Shadows

| Variable | Default |
|----------|---------|
| `--wox-shadow-sm` | `0 2px 4px rgba(0,0,0,0.3)` |
| `--wox-shadow-md` | `0 4px 16px rgba(0,0,0,0.4)` |
| `--wox-shadow-lg` | `0 12px 32px rgba(0,0,0,0.6)` |
| `--wox-shadow-xl` | `0 24px 80px rgba(0,0,0,0.8)` |
| `--wox-shadow-input` | `inset 0 1px 3px rgba(0,0,0,0.2)` |
| `--wox-shadow-section` | `inset 0 -12px 24px -12px rgba(0,0,0,0.5)` |
| `--wox-shadow-accent` | `0 0 10px rgba(0,229,255,0.3)` |

### Transitions

| Variable | Default |
|----------|---------|
| `--wox-transition-fast` | `0.12s ease` |
| `--wox-transition-normal` | `0.2s ease` |
| `--wox-transition-smooth` | `0.25s cubic-bezier(0.4, 0, 0.2, 1)` |

### Z-Index

| Variable | Default | Usage |
|----------|---------|-------|
| `--wox-z-base` | `1` | Base layer |
| `--wox-z-dropdown` | `1000` | Dropdowns and menus |
| `--wox-z-overlay` | `10000` | Overlays and popups |
| `--wox-z-modal` | `20000` | Modal dialogs |

### Light Mode

Activate via `data-wox-theme="light"` on `<html>`. 23 variables are overridden automatically.

```js
import { WoxTheme } from 'wox-gui';
WoxTheme.set('light');   // or 'dark'
WoxTheme.toggle();       // flip
WoxTheme.get();          // returns 'dark' | 'light'
WoxTheme.auto();         // OS prefers-color-scheme, respects localStorage
```

Override light-mode colors:

```css
:root[data-wox-theme="light"] {
    --wox-accent: #0077b6;
}
```

---

## Components

### wox-icon

Material Icons wrapper with size control.

**Tag:** `<wox-icon>` — **Class:** `WoxIcon`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Material Icons ligature name (e.g. `"near_me"`, `"layers"`) |
| `size` | `string\|number` | `18` | Icon size in pixels |
| `color` | `string` | — | Custom color for glow/pulse effects |
| `glow` | `boolean` | `false` | Enable neon glow effect (requires `color`) |
| `pulse` | `boolean` | `false` | Enable opacity pulse animation. Composable with `glow` |

**Events:** None.

**Slots:** `default` — fallback SVG content when no `name` is provided.

```html
<wox-icon name="near_me"></wox-icon>
<wox-icon name="layers" size="32"></wox-icon>
<wox-icon name="bolt" color="#ffd600" glow pulse></wox-icon>
```

---

### wox-separator

Horizontal or vertical divider line.

**Tag:** `<wox-separator>` — **Class:** `WoxSeparator`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `direction` | `string` | `"h"` | `"h"` (horizontal) or `"v"` (vertical) |
| `spacing` | `string` | `"0"` | CSS margin value. Top/bottom for horizontal, left/right for vertical |

**Events:** None.

```html
<wox-separator></wox-separator>
<wox-separator direction="v" spacing="4px"></wox-separator>
```

---

### wox-badge

Dot, diamond, and text indicator badges.

**Tag:** `<wox-badge>` — **Class:** `WoxBadge`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `string` | `"dot"` | `"dot"`, `"diamond"`, or `"text"` |
| `text` | `string` | — | Label text (only for `variant="text"`) |
| `color` | `string` | `var(--wox-accent)` | CSS color value |

**Events:** None.

```html
<wox-badge></wox-badge>
<wox-badge variant="diamond" color="#f72585"></wox-badge>
<wox-badge variant="text" text="Active" color="#00e5ff"></wox-badge>
```

---

### wox-button

Multi-variant button (icon, text, tile, dash) with optional glow effects.

**Tag:** `<wox-button>` — **Class:** `WoxButton`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `string` | `"icon"` | `"icon"`, `"text"`, `"tile"`, or `"dash"` |
| `icon` | `string` | — | Material Icons name |
| `label` | `string` | — | Button label text |
| `active` | `boolean` | `false` | Active / selected state |
| `disabled` | `boolean` | `false` | Disabled state |
| `color` | `string` | — | Custom accent color (used by `tile` variant) |
| `size` | `string` | — | Size override in pixels |
| `dash` | `string` | `"solid"` | Dash pattern: `"solid"`, `"dotted"`, `"dashed"`, `"longdash"`, `"dotdash"`, `"zigzag"` |
| `glow` | `boolean` | `false` | Neon glow effect (`tile` + `color`) |
| `pulse` | `boolean` | `false` | Opacity pulse animation. Composable with `glow` |
| `border-color` | `string` | — | Custom border color; applies to all variants in all states |
| `border-style` | `string` | `"solid"` | CSS border-style: `"solid"`, `"dashed"`, `"dotted"`, `"double"`, etc. |
| `icon-color` | `string` | — | Custom icon color; overrides inherited text color on the icon only |
| `text-color` | `string` | — | Custom text/label color; also controls `dash-line` fill in `dash` variant |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-click` | `{ originalEvent }` | Click (not emitted when `disabled`) |

When `border-color`, `icon-color`, or `text-color` are set they persist through hover and active states — visual feedback is still provided by the background change. They can be combined freely with `color` (tile accent) and `glow`/`pulse`.

```html
<wox-button variant="icon" icon="near_me" active></wox-button>
<wox-button variant="text" icon="add" label="Create"></wox-button>
<wox-button variant="tile" icon="star" label="Fav" color="#f72585" glow></wox-button>
<wox-button variant="dash" dash="dashed"></wox-button>

<!-- Custom colors -->
<wox-button variant="icon" icon="star" border-color="#ffd600" icon-color="#ffd600"></wox-button>
<wox-button variant="text" icon="bolt" label="Flash" border-color="#f72585" icon-color="#f72585" text-color="#f72585"></wox-button>
<wox-button variant="tile" icon="layers" label="Layer" icon-color="#4cc9f0" text-color="#4cc9f0"></wox-button>
<wox-button variant="dash" dash="dashed" border-color="#4361ee" text-color="#4cc9f0" active></wox-button>

<!-- Custom border style -->
<wox-button variant="icon" icon="star" border-style="dashed"></wox-button>
<wox-button variant="icon" icon="bolt" border-style="dotted" border-color="#f72585" icon-color="#f72585"></wox-button>
<wox-button variant="text" icon="add" label="Create" border-style="dashed" border-color="#4cc9f0" text-color="#4cc9f0"></wox-button>
<wox-button variant="tile" icon="near_me" label="Select" border-style="dashed"></wox-button>
```

---

### wox-input

Input field supporting multiple types with optional label, unit suffix, and drag scrubbing.

**Tag:** `<wox-input>` — **Class:** `WoxInput`

**Supported types:** `text` (default), `number`, `password`, `email`, `url`, `tel`, `search`, `color`, `date`, `time`, `datetime-local`, `range`.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | `string` | `"text"` | Input type (see list above) |
| `value` | `string` | — | Current input value |
| `label` | `string` | — | Label text above the input |
| `unit` | `string` | — | Unit suffix (e.g. `"px"`, `"%"`, `"deg"`) — ignored for `color`/`range` |
| `placeholder` | `string` | — | Placeholder text |
| `min` | `number` | — | Minimum value (`number`/`range` only) |
| `max` | `number` | — | Maximum value (`number`/`range` only) |
| `step` | `number` | — | Step increment (`number`/`range` only) |
| `disabled` | `boolean` | `false` | Disabled state |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-input` | `{ value }` | Every keystroke. `number`/`range` mode emits `parseFloat(value)` |
| `wox-change` | `{ value }` | On blur or Enter |

**JS property:** `value` — gets or sets the current value programmatically.

**Drag scrubbing:** Click and drag on the label to adjust number values by step.

**Notes:** `date`/`time`/`datetime-local` use dark color-scheme for native pickers. Invalid type values fall back to `"text"`.

```html
<wox-input type="number" label="X" value="100" min="0" max="1920" step="1" unit="px"></wox-input>
<wox-input type="text" label="Name" placeholder="Layer name"></wox-input>
<wox-input type="password" label="Password" placeholder="Enter password…"></wox-input>
<wox-input type="email" label="Email" placeholder="user@example.com"></wox-input>
<wox-input type="color" label="Fill" value="#00e5ff"></wox-input>
<wox-input type="date" label="Start Date"></wox-input>
<wox-input type="range" label="Volume" value="50" min="0" max="100"></wox-input>
```

---

### wox-slider

Custom range slider with label and value display.

**Tag:** `<wox-slider>` — **Class:** `WoxSlider`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | — | Current value |
| `min` | `number` | `0` | Minimum |
| `max` | `number` | `100` | Maximum |
| `step` | `number` | `1` | Step increment |
| `label` | `string` | — | Label on the left |
| `unit` | `string` | — | Unit suffix for display |
| `show-value` | `boolean` | `false` | Show numeric value on the right |
| `color` | `string` | — | Custom accent color for fill track and FX |
| `glow` | `boolean` | `false` | Neon glow on thumb |
| `pulse` | `boolean` | `false` | Opacity pulse on thumb |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-input` | `{ value }` | Continuously during drag |
| `wox-change` | `{ value }` | On mouse up |

```html
<wox-slider value="100" min="0" max="100" label="Opacity" unit="%" show-value></wox-slider>
```

---

### wox-color-swatch

Clickable color preview square with alpha support.

**Tag:** `<wox-color-swatch>` — **Class:** `WoxColorSwatch`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string` | `"transparent"` | CSS color value |
| `size` | `string` | `"24"` | Size in pixels |
| `selected` | `boolean` | `false` | Selected state with highlight border |
| `glow` | `boolean` | `false` | Neon glow using swatch's own color |
| `pulse` | `boolean` | `false` | Opacity pulse |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-click` | `{ color }` | On click |

```html
<wox-color-swatch color="#00e5ff"></wox-color-swatch>
<wox-color-swatch color="rgba(0,229,255,0.5)" size="32" selected></wox-color-swatch>
```

---

### wox-tooltip

Hover tooltip wrapper with 4 positions.

**Tag:** `<wox-tooltip>` — **Class:** `WoxTooltip`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | `string` | — | Tooltip message |
| `position` | `string` | `"top"` | `"top"`, `"bottom"`, `"left"`, `"right"` |
| `delay` | `number` | — | Show delay in ms (reserved) |

**Events:** None. **Slot:** `default` — the element that triggers the tooltip on hover.

```html
<wox-tooltip text="Selection Tool (V)">
    <wox-button variant="icon" icon="near_me"></wox-button>
</wox-tooltip>
```

---

### wox-select

Searchable single or multi-select dropdown with keyboard navigation.

**Tag:** `<wox-select>` — **Class:** `WoxSelect`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Multi-select mode with tag chips |
| `searchable` | `boolean` | `false` | Shows search input inside dropdown |
| `placeholder` | `string` | `"Select an option"` | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `value` | `string\|string[]` | `""` | Selected value (JS property) |
| `options` | `string` | `"[]"` | JSON array of `{ value, label, image? }` objects |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-change` | `{ value }` | On selection change |
| `wox-open` | — | Dropdown opens |
| `wox-close` | — | Dropdown closes |
| `wox-search` | `{ query }` | Search input change |

| Method | Description |
|--------|-------------|
| `open()` | Opens dropdown |
| `close()` | Closes dropdown |
| `toggle()` | Toggles open/closed |
| `selectOption(value)` | Selects option by value |
| `deselectOption(value)` | Deselects option by value |
| `getSelectedOptions()` | Returns array of selected option objects |
| `setOptions(options)` | Replaces all options and clears selection |

**Option format:** `{ value: string, label: string, image?: string }` — `image` is an optional avatar URL (20px circle).

**Keyboard:** ArrowDown/Up to navigate, Enter to select, Escape/Tab to close.

```html
<wox-select id="sel" searchable multiple placeholder="Pick tags..."></wox-select>
<script>
    document.getElementById('sel').setOptions([
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
    ]);
</script>
```

---

### wox-date-picker

Calendar date picker with single and range selection.

**Tag:** `<wox-date-picker>` — **Class:** `WoxDatePicker`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `range-mode` | `boolean` | `false` | Enable range selection (start + end) |
| `value` | `string` | — | Selected date `YYYY-MM-DD` (single mode) |
| `range-start` | `string` | — | Range start `YYYY-MM-DD` (range mode) |
| `range-end` | `string` | — | Range end `YYYY-MM-DD` (range mode) |
| `disabled` | `boolean` | `false` | Disables interaction |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-change` | `{ date }` | Single mode: date selected |
| `wox-change` | `{ start, end }` | Range mode: both endpoints set |

| Method | Description |
|--------|-------------|
| `setDate(dateStr)` | Select date and navigate to its month (single mode) |
| `setRange(start, end)` | Set range endpoints (range mode) |
| `getSelectedDate()` | Returns `YYYY-MM-DD` string or `null` |
| `getSelectedRange()` | Returns `{ start, end }` |
| `clear()` | Clears selection |

**JS properties:** `rangeMode` (boolean), `disabled` (boolean).

```html
<wox-date-picker value="2026-03-15"></wox-date-picker>
<wox-date-picker range-mode range-start="2026-03-01" range-end="2026-03-15"></wox-date-picker>
```

---

### wox-color-picker

HSV wheel color picker with alpha slider and hex input.

**Tag:** `<wox-color-picker>` — **Class:** `WoxColorPicker`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string` | — | Initial CSS hex color (e.g. `"#00e5ff"`) |
| `alpha` | `number` | `1` | Opacity 0–1 |
| `open` | `boolean` | `false` | Show/hide popup |

| Method | Parameters | Description |
|--------|------------|-------------|
| `showAt(anchorEl)` | `HTMLElement` | Position near anchor with viewport clamping, then open |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-color-change` | `{ color: [r,g,b,a] }` | During adjustment. Values 0–1 |
| `wox-color-close` | — | Close button clicked |

Features: circular hue ring, saturation/value square, alpha slider, hex input, draggable popup header, viewport constraints.

```html
<wox-color-swatch id="swatch" color="#00e5ff"></wox-color-swatch>
<wox-color-picker id="picker" color="#00e5ff"></wox-color-picker>
<script>
    swatch.addEventListener('wox-click', () => picker.showAt(swatch));
    picker.addEventListener('wox-color-change', (e) => {
        const [r,g,b] = e.detail.color.map(c => Math.round(c * 255));
        swatch.setAttribute('color', `rgb(${r},${g},${b})`);
    });
</script>
```

---

### wox-menu-item

Menu entry with icon, shortcut, and submenu indicator.

**Tag:** `<wox-menu-item>` — **Class:** `WoxMenuItem`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Display text |
| `shortcut` | `string` | — | Keyboard shortcut hint (e.g. `"Ctrl+N"`) |
| `icon` | `string` | — | Material Icons name |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `string` | `"item"` | `"item"`, `"separator"`, or `"header"` |
| `submenu` | `boolean` | `false` | Show right-arrow indicator |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-select` | `{ label }` | Non-disabled item clicked |

```html
<wox-menu-item label="Save" shortcut="Ctrl+S" icon="save"></wox-menu-item>
<wox-menu-item type="separator"></wox-menu-item>
<wox-menu-item type="header" label="Export"></wox-menu-item>
```

---

### wox-menu

Dropdown menu with click/hover/context triggers.

**Tag:** `<wox-menu>` — **Class:** `WoxMenu`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Trigger button label |
| `open` | `boolean` | `false` | Show/hide dropdown |
| `trigger` | `string` | `"click"` | `"click"`, `"hover"`, or `"context"` |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-open` | — | Menu opened |
| `wox-close` | — | Menu closed |
| `wox-click` | `{ label }` | Emitted when clicked with no children (acts as a plain button) |

**Slot:** `default` — `<wox-menu-item>` children.

Auto-closes on item selection, outside click, or menubar navigation. Viewport-flips to stay visible.

When no `<wox-menu-item>` children are present, clicking the trigger emits `wox-click` instead of opening a dropdown — useful for top-level menu actions that don't have a submenu.

```html
<wox-menu label="File">
    <wox-menu-item label="New" shortcut="Ctrl+N" icon="add"></wox-menu-item>
    <wox-menu-item label="Open" shortcut="Ctrl+O" icon="folder_open"></wox-menu-item>
    <wox-menu-item type="separator"></wox-menu-item>
    <wox-menu-item label="Save" shortcut="Ctrl+S" icon="save"></wox-menu-item>
</wox-menu>
```

---

### wox-context-menu

Right-click context menu (static API).

**Tag:** `<wox-context-menu>` — **Class:** `WoxContextMenu`

| Static Method | Parameters | Description |
|---------------|------------|-------------|
| `WoxContextMenu.show(event, items)` | `MouseEvent`, `Array` | Show at pointer position |
| `WoxContextMenu.hide()` | — | Dismiss |

**Item properties:** `{ label, icon?, action?, disabled?, divider?, shortcut? }`

Singleton pattern — only one at a time. Viewport-clamped. Dismisses on Escape or outside click.

```js
canvas.addEventListener('contextmenu', (e) => {
    WoxContextMenu.show(e, [
        { label: 'Cut', icon: 'content_cut', shortcut: 'Ctrl+X', action: () => cut() },
        { label: 'Copy', icon: 'content_copy', shortcut: 'Ctrl+C', action: () => copy() },
        { divider: true },
        { label: 'Delete', icon: 'delete', shortcut: 'Del', action: () => remove() },
    ]);
});
```

---

### wox-layer-item

Layer panel row with visibility, lock, and inline rename.

**Tag:** `<wox-layer-item>` — **Class:** `WoxLayerItem`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Layer name |
| `type` | `string` | — | Shape type for icon (see below) |
| `visible` | `boolean` | `false` | Visibility state |
| `locked` | `boolean` | `false` | Lock state |
| `selected` | `boolean` | `false` | Selected state |
| `depth` | `number` | `0` | Nesting depth: `0`, `1`, or `2` |

**Type icons:** `rectangle` → `crop_square`, `ellipse` → `radio_button_unchecked`, `path` → `timeline`, `image` → `image`, `text` → `text_fields`, `group` → `folder`, `layer` → `layers`.

**Depth indentation:** `0` = 0, `1` = 24px, `2` = 40px.

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-select` | `{ name }` | Row clicked |
| `wox-visibility` | `{ visible }` | Eye icon toggled |
| `wox-lock` | `{ locked }` | Lock icon toggled |

**Double-click** the name to enter inline rename mode.

```html
<wox-layer-item name="Background" type="rectangle" visible></wox-layer-item>
<wox-layer-item name="Header" type="group" visible depth="1"></wox-layer-item>
<wox-layer-item name="Title" type="text" visible depth="2"></wox-layer-item>
```

---

### wox-gradient-editor

Interactive gradient color-stop editor bar.

**Tag:** `<wox-gradient-editor>` — **Class:** `WoxGradientEditor`

**JS property:** `gradient` — gradient data object:

```js
{ type: 'linear'|'radial', angle: number, stops: [{ color: '#rrggbb', position: 0-100 }, ...] }
```

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-gradient-input` | `{ gradient, css }` | During drag or color picking |
| `wox-gradient-change` | `{ gradient, css }` | On mouseup, stop add/remove, color finalized |

**Exported utils:** `gradientToCSS(gradient)` → CSS string, `cssToGradient(css)` → gradient object.

Interactions: drag stops to reposition, double-click to add, drag 40px down to remove, click to pick color. Minimum 2 stops.

```js
editor.gradient = {
    type: 'linear', angle: 90,
    stops: [{ color: '#ff0000', position: 0 }, { color: '#0000ff', position: 100 }]
};
```

---

### wox-gradient-selector

Full gradient picker with presets, editor dialog, and animation controls.

**Tag:** `<wox-gradient-selector>` — **Class:** `WoxGradientSelector`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | `'#ffffff'` | CSS hex color or gradient string |
| `animation-speed` | `number` | `0` | Animation speed 0–10 |
| `animation-type` | `string` | `'pingpong'` | `'pingpong'` or `'cycle'` |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-gradient-change` | `{ value, animationSpeed, animationType }` | Value or animation changed |

Features: preset dropdown, solid color option, custom gradient dialog with `wox-gradient-editor`, linear/radial type switch, angle slider, speed/type controls. Gradients persisted in `localStorage` (key: `wox_gradients`).

```html
<wox-gradient-selector value="linear-gradient(135deg, #ff512f 0%, #f09819 100%)"></wox-gradient-selector>
```

---

### wox-section

Collapsible panel section with header actions.

**Tag:** `<wox-section>` — **Class:** `WoxSection`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | `string` | — | Section title |
| `collapsed` | `boolean` | `false` | Collapsed state |
| `icon` | `string` | — | Material Icons name |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-toggle` | `{ collapsed }` | Header clicked |

**Slots:** `default` — body content, `header-actions` — right-side header buttons.

```html
<wox-section title="Transform">
    <wox-input type="number" label="X" value="100" unit="px"></wox-input>
</wox-section>

<wox-section title="Layers">
    <template slot="header-actions">
        <wox-button variant="icon" icon="add" size="16"></wox-button>
    </template>
    <wox-layer-item name="BG" type="rectangle" visible></wox-layer-item>
</wox-section>
```

---

### wox-tab

Individual tab panel (used inside `<wox-tabs>`).

**Tag:** `<wox-tab>` — **Class:** `WoxTab`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique tab identifier |
| `label` | `string` | — | Display label in tab header |
| `icon` | `string` | — | Material Icons name for header |
| `active` | `boolean` | `false` | Active state (managed by parent) |

**Events:** None. Visibility managed by parent `<wox-tabs>`.

---

### wox-tabs

Tab container with auto-generated header buttons.

**Tag:** `<wox-tabs>` — **Class:** `WoxTabs`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `active` | `string` | — | `name` of the active tab |
| `placement` | `string` | `"top"` | Header position: `"top"`, `"left"`, `"right"` |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-tab-change` | `{ name }` | Tab header button clicked |

**Slot:** `default` — `<wox-tab>` children.

```html
<wox-tabs active="design">
    <wox-tab name="design" label="Design">Design content</wox-tab>
    <wox-tab name="inspect" label="Inspect">Inspect content</wox-tab>
</wox-tabs>
```

---

### wox-toolbar-group

Toolbar button group with optional label.

**Tag:** `<wox-toolbar-group>` — **Class:** `WoxToolbarGroup`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Uppercase label below the group |

**Slot:** `default` — buttons (typically `<wox-button variant="icon">`).

```html
<wox-toolbar-group label="Draw">
    <wox-button variant="icon" icon="crop_square"></wox-button>
    <wox-button variant="icon" icon="circle"></wox-button>
</wox-toolbar-group>
```

---

### wox-toolbar

Vertical toolbar container.

**Tag:** `<wox-toolbar>` — **Class:** `WoxToolbar`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | `string` | `"44px"` | Toolbar width |
| `position` | `string` | `"left"` | `"left"` or `"right"` |

**Slot:** `default` — `<wox-toolbar-group>` children. Position-aware border (right border for left toolbar, left border for right).

```html
<wox-toolbar>
    <wox-toolbar-group label="Select">
        <wox-button variant="icon" icon="near_me" active></wox-button>
    </wox-toolbar-group>
</wox-toolbar>
```

---

### wox-panel

Resizable side panel.

**Tag:** `<wox-panel>` — **Class:** `WoxPanel`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | `string` | `"280px"` | Panel width |
| `position` | `string` | `"right"` | `"left"` or `"right"` |
| `resizable` | `boolean` | `false` | Enable drag-to-resize (180px–600px) |

**Slot:** `default` — panel content. Scrollable with `overflow-y: auto`.

```html
<wox-panel position="left" width="260px" resizable>
    <wox-section title="Layers">
        <wox-layer-item name="BG" type="rectangle" visible></wox-layer-item>
    </wox-section>
</wox-panel>
```

---

### wox-menubar

Horizontal menu bar with keyboard navigation.

**Tag:** `<wox-menubar>` — **Class:** `WoxMenubar`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | `string` | `"32px"` | Menu bar height |

**Slot:** `default` — logo element and `<wox-menu>` children. Left/Right arrow keys navigate between open menus.

```html
<wox-menubar>
    <wox-menu label="File">
        <wox-menu-item label="New" shortcut="Ctrl+N"></wox-menu-item>
    </wox-menu>
    <wox-menu label="Edit">
        <wox-menu-item label="Undo" shortcut="Ctrl+Z"></wox-menu-item>
    </wox-menu>
</wox-menubar>
```

---

### wox-statusbar

Three-column bottom status bar.

**Tag:** `<wox-statusbar>` — **Class:** `WoxStatusbar`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | `string` | `"24px"` | Bar height |

**Slots:** `left`, `center`, `right`.

```html
<wox-statusbar>
    <span slot="left">Ready</span>
    <span slot="center">Zoom: 100%</span>
    <span slot="right">1920 x 1080</span>
</wox-statusbar>
```

---

### wox-modal

Dialog overlay with backdrop, escape key, and animations.

**Tag:** `<wox-modal>` — **Class:** `WoxModal`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | `boolean` | `false` | Show/hide modal |
| `title` | `string` | — | Dialog title |
| `closable` | `boolean` | `true` | Show close button. Set `closable="false"` to hide |
| `width` | `string` | `"400px"` | Max width (min 300px) |
| `color` | `string` | — | Custom color for glow/pulse |
| `glow` | `boolean` | `false` | Neon glow on dialog box |
| `pulse` | `boolean` | `false` | Opacity pulse |

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-close` | — | Closed via X, Escape, or backdrop |
| `wox-confirm` | — | Default OK button clicked |
| `wox-cancel` | — | Default Cancel button clicked |

| Method / Property | Description |
|-------------------|-------------|
| `open()` | Sets `open` attribute |
| `close()` | Removes `open` attribute |
| `openState` | Boolean getter/setter |

**Slots:** `default` — body, `footer` — custom buttons (replaces default Cancel/OK).

```html
<wox-modal open title="Confirm Action">
    <p>Are you sure?</p>
</wox-modal>
```

---

### wox-datagrid

Sortable data grid with resizable/reorderable columns and inline editing.

**Tag:** `<wox-datagrid>` — **Class:** `WoxDatagrid`

**JS properties (not attributes):**

- `columns` — array of column definitions:
  - `key` (string, required), `label` (string, default: key), `width` (number, default: 120), `align` (`"left"`, `"center"`, `"right"`), `sortable` (boolean, default: true), `editable` (boolean, default: true)
- `rows` — array of plain objects with keys matching column `key` values

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-sort` | `{ key, direction }` | Sort changed (`"asc"` or `"desc"`) |
| `wox-row-click` | `{ row, index }` | Row clicked |
| `wox-cell-change` | `{ row, key, oldValue, newValue }` | Inline edit committed |

Features: click header to sort (numbers numerically, strings with localeCompare), drag header edge to resize (min 40px), drag header to reorder, double-click cell to edit inline, odd/even striping, scrollable body with fixed header.

Set a fixed `height` on the element for scrollable body.

```js
grid.columns = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'size', label: 'Size', width: 100, align: 'right' },
];
grid.rows = [
    { name: 'logo.png', size: 1024 },
    { name: 'style.css', size: 48 },
];
```

---

### wox-toast

Toast notifications with auto-dismiss and deduplication (static API).

**Tag:** `<wox-toast>` — **Class:** `WoxToast`

| Static Method | Parameters | Description |
|---------------|------------|-------------|
| `WoxToast.success(msg, opts?)` | `string`, `object` | Green success toast |
| `WoxToast.error(msg, opts?)` | `string`, `object` | Red error toast |
| `WoxToast.warning(msg, opts?)` | `string`, `object` | Orange warning toast |
| `WoxToast.info(msg, opts?)` | `string`, `object` | Blue info toast |

**Options:** `{ duration: 4000, closable: true, position: 'BR' }`

**Position codes:** `TL`, `TC`, `TR`, `BL`, `BC`, `BR`

Features: progress bar countdown, pause-on-hover, deduplication (same type+message ignored), slide animations, collapse on exit.

```js
WoxToast.success('Settings saved!');
WoxToast.error('Connection lost', { duration: 0, position: 'TR' });
```

---

### wox-theme-toggle

Sun/moon icon button for dark/light theme switching.

**Tag:** `<wox-theme-toggle>` — **Class:** `WoxThemeToggle`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `auto` | `boolean` | `false` | Call `WoxTheme.auto()` on connect (OS preference with localStorage override) |

Shows sun icon (`light_mode`) in dark theme, moon icon (`dark_mode`) in light theme. Calls `WoxTheme.toggle()` on click. Listens for `wox-theme-change` events to stay in sync.

```html
<wox-theme-toggle auto></wox-theme-toggle>
```

---

## Full Layout Example

```html
<div style="display: flex; flex-direction: column; height: 100vh;">
    <wox-menubar>
        <wox-menu label="File">
            <wox-menu-item label="New" shortcut="Ctrl+N" icon="add"></wox-menu-item>
            <wox-menu-item label="Save" shortcut="Ctrl+S" icon="save"></wox-menu-item>
        </wox-menu>
        <wox-menu label="Edit">
            <wox-menu-item label="Undo" shortcut="Ctrl+Z"></wox-menu-item>
            <wox-menu-item label="Redo" shortcut="Ctrl+Shift+Z"></wox-menu-item>
        </wox-menu>
    </wox-menubar>

    <div style="display: flex; flex: 1;">
        <wox-toolbar>
            <wox-toolbar-group label="Tools">
                <wox-button variant="icon" icon="near_me" active></wox-button>
                <wox-button variant="icon" icon="crop_square"></wox-button>
            </wox-toolbar-group>
        </wox-toolbar>

        <div style="flex: 1; background: var(--wox-bg-canvas);"></div>

        <wox-panel width="280px" resizable>
            <wox-tabs active="design">
                <wox-tab name="design" label="Design">
                    <wox-section title="Transform">
                        <wox-input type="number" label="X" value="100" unit="px"></wox-input>
                        <wox-input type="number" label="Y" value="200" unit="px"></wox-input>
                    </wox-section>
                    <wox-section title="Fill">
                        <wox-color-swatch color="#00e5ff"></wox-color-swatch>
                    </wox-section>
                </wox-tab>
                <wox-tab name="inspect" label="Inspect">
                    <wox-section title="CSS">
                        <p>width: 300px;</p>
                    </wox-section>
                </wox-tab>
            </wox-tabs>
        </wox-panel>
    </div>

    <wox-statusbar>
        <span slot="left">Ready</span>
        <span slot="center">100%</span>
        <span slot="right">1920 x 1080</span>
    </wox-statusbar>
</div>
```
