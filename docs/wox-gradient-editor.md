# wox-gradient-editor

Interactive gradient color-stop editor bar. Drag stops to reposition, double-click the bar to add, drag down to remove, and click a stop to pick its color.

**Tag:** `<wox-gradient-editor>`
**Source:** `src/wox-gradient-editor.js`
**Class:** `WoxGradientEditor`

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `gradient` | `object` | `null` | Gradient data object (JS property, not an HTML attribute). See shape below |

---

## Gradient Object Shape

```javascript
{
    type: 'linear' | 'radial',
    angle: number,                  // degrees (used for linear)
    stops: [
        { color: '#rrggbb', position: number },  // position 0-100
        ...
    ]
}
```

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-gradient-input` | `{ gradient, css }` | Emitted continuously during drag or color picking |
| `wox-gradient-change` | `{ gradient, css }` | Emitted on mouseup, stop add, stop remove, or color finalized |

Both events include a deep copy of the gradient object and the computed CSS gradient string.

---

## Exported Functions

The module also exports two utility functions:

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `gradientToCSS(gradient)` | `{ type, angle, stops }` | `string` | Convert a gradient object to a CSS gradient string |
| `cssToGradient(css)` | `string` | `{ type, angle, stops } \| null` | Parse a CSS gradient string into a gradient object |

---

## Features

### Drag to reposition

Grab a color-stop handle and drag horizontally to change its position along the bar (0-100%).

### Double-click to add

Double-click anywhere on the gradient bar to insert a new stop at that position. The color is interpolated from neighbors.

### Drag down to remove

While dragging a handle, pull it more than 40px away vertically to remove the stop. A minimum of 2 stops is enforced.

### Click to pick color

Click a handle to open a native color picker for that stop. Dragging does not accidentally trigger the picker.

---

## Examples

### Basic setup

```html
<wox-gradient-editor id="editor"></wox-gradient-editor>

<script type="module">
    const editor = document.getElementById('editor');
    editor.gradient = {
        type: 'linear',
        angle: 90,
        stops: [
            { color: '#ff0000', position: 0 },
            { color: '#0000ff', position: 100 }
        ]
    };
</script>
```

### Listening for changes

```javascript
const editor = document.querySelector('wox-gradient-editor');

editor.addEventListener('wox-gradient-input', (e) => {
    // Live preview during drag
    preview.style.background = e.detail.css;
});

editor.addEventListener('wox-gradient-change', (e) => {
    // Final value on release
    console.log('Gradient:', e.detail.gradient);
    console.log('CSS:', e.detail.css);
});
```

### Using utility functions

```javascript
import { gradientToCSS, cssToGradient } from './src/wox-gradient-editor.js';

const gradient = {
    type: 'linear',
    angle: 135,
    stops: [
        { color: '#ff512f', position: 0 },
        { color: '#f09819', position: 100 }
    ]
};

const css = gradientToCSS(gradient);
// "linear-gradient(135deg, #ff512f 0%, #f09819 100%)"

const parsed = cssToGradient(css);
// { type: 'linear', angle: 135, stops: [...] }
```
