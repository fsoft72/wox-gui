# wox-gradient-selector

Full gradient picker with preset dropdown, solid color option, custom gradient editor dialog, type/angle/speed controls, and localStorage persistence.

**Tag:** `<wox-gradient-selector>`
**Source:** `src/wox-gradient-selector.js`
**Class:** `WoxGradientSelector`

---

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | `'#ffffff'` | CSS value: hex color (e.g. `'#ff0000'`) or gradient string |
| `animation-speed` | `number` | `0` | Animation speed from `0` (off) to `10` |
| `animation-type` | `string` | `'pingpong'` | Animation type: `'pingpong'` or `'cycle'` |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-gradient-change` | `{ value, animationSpeed, animationType }` | Emitted when the selected value, speed, or animation type changes |

---

## Features

### Dropdown with presets

Clicking the selector opens a dropdown listing all saved gradients. Selecting a preset applies it immediately.

### Solid color option

The first dropdown item opens a native color picker for choosing a solid color instead of a gradient.

### Custom gradient dialog

The "Custom Gradient..." option opens a modal containing a `wox-gradient-editor`, a name input, and Apply / Save & Apply buttons. Saved gradients are added to the dropdown.

### Type and angle controls

When a gradient is selected, controls appear for switching between linear and radial types and adjusting the angle (linear only) via a slider.

### Animation speed and type

A speed slider (0-10) and animation type selector (pingpong / cycle) are shown when a gradient is active. The animation type row is only visible when speed is greater than 0.

### localStorage persistence

Saved gradients are persisted under the `wox_gradients` key in localStorage. On first use, the component seeds the store with default presets.

---

## Built-in Presets

| Name | Colors |
|------|--------|
| Sunset | `#ff512f` to `#f09819` |
| Ocean | `#2193b0` to `#6dd5ed` |
| Forest | `#11998e` to `#38ef7d` |
| Purple Haze | `#7b4397` to `#dc2430` |
| Midnight | `#232526` to `#414345` |
| Peach | `#ffecd2` to `#fcb69f` |

---

## Examples

### Basic usage

```html
<wox-gradient-selector></wox-gradient-selector>
```

### With initial gradient

```html
<wox-gradient-selector value="linear-gradient(135deg, #ff512f 0%, #f09819 100%)"></wox-gradient-selector>
```

### Listening for changes

```javascript
const selector = document.querySelector('wox-gradient-selector');

selector.addEventListener('wox-gradient-change', (e) => {
    const { value, animationSpeed, animationType } = e.detail;
    element.style.background = value;
    console.log('Speed:', animationSpeed, 'Type:', animationType);
});
```
