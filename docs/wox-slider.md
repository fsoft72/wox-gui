# wox-slider

Custom range slider with accent-colored fill track, optional label, and numeric value display.

**Tag:** `<wox-slider>`
**Source:** `src/wox-slider.js`
**Class:** `WoxSlider`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | — | Current slider value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `label` | `string` | — | Label text on the left |
| `unit` | `string` | — | Unit suffix for value display (e.g. `"%"`) |
| `show-value` | `boolean` | `false` | Show numeric value on the right (presence attribute) |
| `color` | `string` | — | Custom accent color for fill track and FX effects |
| `glow` | `boolean` | `false` | Enable neon glow on the slider thumb |
| `pulse` | `boolean` | `false` | Enable opacity pulse on the thumb. Composable with `glow`. |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-input` | `{ value }` | Emitted continuously during drag |
| `wox-change` | `{ value }` | Emitted when drag ends (mouse up) |

---

## Features

### Custom track

The slider renders a custom track with an accent-colored fill indicating the current position. The thumb is a 14px white-bordered circle.

### Smart value formatting

- Integer steps: values are rounded to whole numbers
- Float steps (e.g. `step="0.01"`): values display with 2 decimal places
- Percentage unit: `unit="%"` appends `%` to the displayed value

---

### Glow & Pulse Effects

When `glow` and/or `pulse` attributes are present, the slider thumb renders with animated effects. The `color` attribute also tints the fill track.

```html
<!-- Glowing thumb with custom color -->
<wox-slider label="ENERGY" value="75" color="#00e676" glow show-value></wox-slider>

<!-- Glow + Pulse -->
<wox-slider label="HEAT" value="50" color="#f72585" glow pulse show-value></wox-slider>

<!-- Pulse only -->
<wox-slider label="SYNC" value="30" color="#4cc9f0" pulse show-value></wox-slider>
```

---

## Examples

### Basic slider

```html
<wox-slider value="50"></wox-slider>
```

### Opacity slider with label and value

```html
<wox-slider value="100" min="0" max="100" step="1" label="Opacity" unit="%" show-value></wox-slider>
```

### Fine-grained control

```html
<wox-slider value="1.5" min="0" max="10" step="0.1" label="Zoom" show-value></wox-slider>
```

### Wide range

```html
<wox-slider value="128" min="0" max="255" step="1" label="Red" show-value></wox-slider>
<wox-slider value="200" min="0" max="255" step="1" label="Green" show-value></wox-slider>
<wox-slider value="64" min="0" max="255" step="1" label="Blue" show-value></wox-slider>
```

### Event handling

```javascript
const slider = document.querySelector('wox-slider');

// Live updates during drag
slider.addEventListener('wox-input', (e) => {
    preview.style.opacity = e.detail.value / 100;
});

// Final value on release
slider.addEventListener('wox-change', (e) => {
    console.log('Final value:', e.detail.value);
});
```
