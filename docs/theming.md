# Theming

WOX-GUI uses CSS custom properties for theming, defined in `css/wox-theme.css`. Override any variable in your own stylesheet to customize the look.

---

## Colors

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

| Variable | Default | Usage |
|----------|---------|-------|
| `--wox-border` | `#333` | Standard border color |
| `--wox-border-light` | `#444` | Lighter border variant |
| `--wox-border-section` | `#2e2e2e` | Section divider border |

---

## Spacing

Based on an 8px grid system:

| Variable | Default |
|----------|---------|
| `--wox-space-xs` | `2px` |
| `--wox-space-sm` | `4px` |
| `--wox-space-md` | `8px` |
| `--wox-space-lg` | `12px` |
| `--wox-space-xl` | `16px` |
| `--wox-space-2xl` | `24px` |

---

## Border Radius

| Variable | Default |
|----------|---------|
| `--wox-radius-sm` | `3px` |
| `--wox-radius-md` | `6px` |
| `--wox-radius-lg` | `8px` |
| `--wox-radius-xl` | `10px` |
| `--wox-radius-2xl` | `12px` |
| `--wox-radius-round` | `50%` |

---

## Typography

### Font Families

| Variable | Default |
|----------|---------|
| `--wox-font` | `'Inter', 'Segoe UI', sans-serif` |
| `--wox-font-mono` | `'Courier New', monospace` |

### Font Sizes

| Variable | Default |
|----------|---------|
| `--wox-font-xs` | `9px` |
| `--wox-font-sm` | `10px` |
| `--wox-font-md` | `11px` |
| `--wox-font-base` | `12px` |
| `--wox-font-lg` | `13px` |
| `--wox-font-xl` | `14px` |
| `--wox-font-2xl` | `16px` |

---

## Shadows

| Variable | Default | Usage |
|----------|---------|-------|
| `--wox-shadow-sm` | `0 2px 4px rgba(0,0,0,0.3)` | Subtle elevation |
| `--wox-shadow-md` | `0 4px 16px rgba(0,0,0,0.4)` | Medium elevation |
| `--wox-shadow-lg` | `0 12px 32px rgba(0,0,0,0.6)` | High elevation |
| `--wox-shadow-xl` | `0 24px 80px rgba(0,0,0,0.8)` | Maximum elevation |
| `--wox-shadow-input` | `inset 0 1px 3px rgba(0,0,0,0.2)` | Inset input field shadow |
| `--wox-shadow-section` | `inset 0 -12px 24px -12px rgba(0,0,0,0.5)` | Section bottom fade |
| `--wox-shadow-accent` | `0 0 10px rgba(0,229,255,0.3)` | Accent glow shadow |

---

## Transitions

| Variable | Default | Usage |
|----------|---------|-------|
| `--wox-transition-fast` | `0.12s ease` | Quick state changes |
| `--wox-transition-normal` | `0.2s ease` | Standard transitions |
| `--wox-transition-smooth` | `0.25s cubic-bezier(0.4, 0, 0.2, 1)` | Smooth, polished motion |

---

## Z-Index Layers

| Variable | Default | Usage |
|----------|---------|-------|
| `--wox-z-base` | `1` | Base layer |
| `--wox-z-dropdown` | `1000` | Dropdowns and menus |
| `--wox-z-overlay` | `10000` | Overlays and popups |
| `--wox-z-modal` | `20000` | Modal dialogs |

---

## Customizing the Theme

Override variables at the `:root` level in your own stylesheet:

```css
:root {
    /* Change accent to purple */
    --wox-accent: #a855f7;

    /* Lighter panel background */
    --wox-bg-panel: #1f1f24;

    /* Larger base font */
    --wox-font-base: 14px;
}
```

Or scope overrides to a specific section:

```css
.sidebar {
    --wox-bg-panel: #1a1a2e;
    --wox-accent: #e94560;
}
```

Because components use Shadow DOM, theme variables must be defined on ancestor elements (or `:root`) -- they inherit through the shadow boundary via CSS custom properties.

---

## Light Mode

WOX-GUI ships with a built-in light theme. When activated, 23 CSS variables are overridden under `:root[data-wox-theme="light"]`, giving every component a light appearance with no extra work.

### Activating Light Mode

Set the `data-wox-theme` attribute on the `<html>` element:

```js
document.documentElement.dataset.woxTheme = 'light';
```

Remove the attribute (or delete it) to return to dark mode:

```js
delete document.documentElement.dataset.woxTheme;
```

### WoxTheme Utility

For convenience, import the `WoxTheme` static utility class:

```js
import { WoxTheme } from 'wox-gui';
```

| Method | Description |
|--------|-------------|
| `WoxTheme.get()` | Returns `'dark'` or `'light'` |
| `WoxTheme.set(theme)` | Sets the theme (`'dark'` or `'light'`). Updates the data attribute, persists to `localStorage`, and dispatches a `wox-theme-change` event on `document.documentElement`. |
| `WoxTheme.toggle()` | Toggles between dark and light |
| `WoxTheme.auto()` | Applies the OS `prefers-color-scheme` preference unless a saved `localStorage` value exists |

### Toggle Component

The `<wox-theme-toggle>` component renders a sun/moon icon button that calls `WoxTheme.toggle()` on click. It listens for `wox-theme-change` events to keep its icon in sync.

```html
<wox-theme-toggle></wox-theme-toggle>

<!-- Respect OS preference on first load -->
<wox-theme-toggle auto></wox-theme-toggle>
```

See [wox-theme-toggle](./wox-theme-toggle.md) for full documentation.

### Overriding Light Theme Colors

You can override specific light-mode variables by targeting the same selector with higher specificity or by loading your overrides after the default theme:

```css
:root[data-wox-theme="light"] {
    --wox-accent: #0077b6;
    --wox-bg-app: #fafafa;
}
```
