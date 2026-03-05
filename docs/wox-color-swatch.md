# wox-color-swatch

A clickable color preview square with alpha channel support via a checkerboard background pattern.

**Tag:** `<wox-color-swatch>`
**Source:** `src/wox-color-swatch.js`
**Class:** `WoxColorSwatch`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string` | `"transparent"` | CSS color value (hex, rgb, rgba, named colors) |
| `size` | `string` | `"24"` | Size in pixels (renders as a square) |
| `selected` | `boolean` | `false` | Selected / active state with highlight border (presence attribute) |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-click` | `{ color }` | Emitted on click with the current color value |

---

## Features

### Alpha visualization

A checkerboard pattern is rendered behind the color, making transparency visible. This is especially useful for semi-transparent colors.

### Selection state

When `selected` is set, the swatch displays a white border and a subtle accent glow.

### Hover effect

Swatches scale slightly on hover and show a border highlight.

---

## Examples

### Basic color swatch

```html
<wox-color-swatch color="#00e5ff"></wox-color-swatch>
```

### Transparent color with checkerboard

```html
<wox-color-swatch color="rgba(0, 229, 255, 0.5)"></wox-color-swatch>
```

### Custom size

```html
<wox-color-swatch color="#f72585" size="32"></wox-color-swatch>
```

### Selected state

```html
<wox-color-swatch color="#4361ee" selected></wox-color-swatch>
```

### Color palette row

```html
<div style="display: flex; gap: 4px;">
    <wox-color-swatch color="#00e5ff"></wox-color-swatch>
    <wox-color-swatch color="#4cc9f0"></wox-color-swatch>
    <wox-color-swatch color="#4361ee"></wox-color-swatch>
    <wox-color-swatch color="#7209b7"></wox-color-swatch>
    <wox-color-swatch color="#f72585"></wox-color-swatch>
</div>
```

### Opening a color picker on click

```javascript
const swatch = document.querySelector('wox-color-swatch');
const picker = document.querySelector('wox-color-picker');

swatch.addEventListener('wox-click', (e) => {
    picker.setAttribute('color', e.detail.color);
    picker.showAt(swatch);
});
```
