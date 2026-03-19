# wox-theme-toggle

Sun/moon icon button for switching between dark and light themes. Calls `WoxTheme.toggle()` on click and stays in sync by listening for `wox-theme-change` events.

**Tag:** `<wox-theme-toggle>`
**Source:** `src/wox-theme-toggle.js`
**Class:** `WoxThemeToggle`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `auto` | `boolean` | `false` | When present, calls `WoxTheme.auto()` on connect — applies the OS `prefers-color-scheme` preference unless a saved `localStorage` value exists |

---

## Events

| Event | Target | Detail | Description |
|-------|--------|--------|-------------|
| `wox-theme-change` | `document.documentElement` | `{ theme: 'dark' \| 'light' }` | Dispatched by `WoxTheme.set()` whenever the theme changes. The toggle listens for this event to update its icon. |

---

## Behavior

- Displays a **sun** icon (`light_mode`) when the current theme is **dark**, indicating "click to switch to light mode".
- Displays a **moon** icon (`dark_mode`) when the current theme is **light**, indicating "click to switch to dark mode".
- The button title attribute updates to match: "Switch to light mode" / "Switch to dark mode".
- Theme preference is persisted to `localStorage` (key: `wox-theme`).

---

## Usage

### Basic toggle

```html
<wox-theme-toggle></wox-theme-toggle>
```

### Auto-detect OS preference

When the `auto` attribute is present, the component calls `WoxTheme.auto()` on connection. This applies the OS `prefers-color-scheme` preference on first load, but respects any previously saved user choice from `localStorage`.

```html
<wox-theme-toggle auto></wox-theme-toggle>
```

### Inside a toolbar

```html
<div class="top-bar">
    <span class="title">My App</span>
    <span style="flex: 1;"></span>
    <wox-theme-toggle></wox-theme-toggle>
</div>
```

### Programmatic theme control

Use the `WoxTheme` utility class directly without the toggle component:

```js
import { WoxTheme } from 'wox-gui';

WoxTheme.set('light');      // switch to light
WoxTheme.set('dark');       // switch to dark
WoxTheme.toggle();          // flip current theme
console.log(WoxTheme.get()) // 'dark' or 'light'
```

### Listening for theme changes

```js
document.documentElement.addEventListener('wox-theme-change', (e) => {
    console.log('Theme changed to:', e.detail.theme);
});
```
