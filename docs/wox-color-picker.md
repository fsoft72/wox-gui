# wox-color-picker

A full-featured HSV color picker with hue wheel, saturation/value square, alpha slider, hex input, and draggable popup positioning.

**Tag:** `<wox-color-picker>`
**Source:** `src/wox-color-picker.js`
**Class:** `WoxColorPicker`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string` | — | Initial color as CSS hex string (e.g. `"#00e5ff"`) |
| `alpha` | `number` | `1` | Alpha / opacity value from `0` to `1` |
| `open` | `boolean` | `false` | Show or hide the picker popup (presence attribute) |

---

## Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `showAt(anchorEl)` | `HTMLElement` | Positions the picker near an anchor element with viewport boundary constraints, then opens it |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-color-change` | `{ color: [r, g, b, a] }` | Emitted during color adjustment. Values are normalized 0-1 |
| `wox-color-close` | — | Emitted when the close button is clicked |

---

## Features

### HSV Wheel

The picker uses a circular hue ring with an inner saturation/value square:

- **Outer ring**: Drag around the ring to select hue (0-360 degrees)
- **Inner square**: Drag horizontally for saturation, vertically for value/brightness

### Alpha slider

A horizontal gradient slider below the wheel for controlling opacity (0-1).

### Color preview

A 34x34px swatch with checkerboard background showing the current color including alpha.

### Hex input

A text field accepting `#RRGGBB` hex values for direct color entry.

### Draggable popup

The picker header can be dragged to reposition the popup anywhere on screen.

### Viewport constraints

When opened via `showAt()`, the popup automatically adjusts its position to stay within the viewport.

---

## Examples

### Basic usage with showAt

```html
<wox-color-swatch id="trigger" color="#00e5ff"></wox-color-swatch>
<wox-color-picker id="picker" color="#00e5ff"></wox-color-picker>

<script type="module">
    const trigger = document.getElementById('trigger');
    const picker = document.getElementById('picker');

    trigger.addEventListener('wox-click', () => {
        picker.showAt(trigger);
    });

    picker.addEventListener('wox-color-change', (e) => {
        const [r, g, b, a] = e.detail.color;
        const hex = '#' + [r, g, b].map(c =>
            Math.round(c * 255).toString(16).padStart(2, '0')
        ).join('');
        trigger.setAttribute('color', hex);
    });

    picker.addEventListener('wox-color-close', () => {
        picker.removeAttribute('open');
    });
</script>
```

### Setting color with alpha

```html
<wox-color-picker color="#f72585" alpha="0.5" open></wox-color-picker>
```

### Reading color values

```javascript
const picker = document.querySelector('wox-color-picker');
picker.addEventListener('wox-color-change', (e) => {
    const [r, g, b, a] = e.detail.color; // Each 0-1
    const r255 = Math.round(r * 255);
    const g255 = Math.round(g * 255);
    const b255 = Math.round(b * 255);
    console.log(`rgba(${r255}, ${g255}, ${b255}, ${a})`);
});
```

---

## Notes

- The picker renders at `z-index: var(--wox-z-modal)` (20000), above all other content
- Color values in the `wox-color-change` event are normalized to 0-1 range, not 0-255
- The component performs internal HSV-to-RGB and RGB-to-hex conversions
