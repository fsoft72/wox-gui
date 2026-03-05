# wox-input

Text and number input field with optional label, unit suffix, and drag-to-scrub for numeric values.

**Tag:** `<wox-input>`
**Source:** `src/wox-input.js`
**Class:** `WoxInput`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | `string` | `"text"` | Input type: `"text"` or `"number"` |
| `value` | `string` | — | Current input value |
| `label` | `string` | — | Label text displayed above the input |
| `unit` | `string` | — | Unit suffix (e.g. `"px"`, `"%"`, `"deg"`) |
| `placeholder` | `string` | — | Placeholder text |
| `min` | `number` | — | Minimum value (number type only) |
| `max` | `number` | — | Maximum value (number type only) |
| `step` | `number` | — | Step increment (number type only) |
| `disabled` | `boolean` | `false` | Disabled state (presence attribute) |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-input` | `{ value }` | Emitted on every keystroke |
| `wox-change` | `{ value }` | Emitted on blur or when Enter is pressed |

---

## Features

### Label with unit

When both `label` and `unit` are set, the unit is displayed next to the label text.

```html
<wox-input type="number" label="Width" unit="px" value="100"></wox-input>
```

### Drag scrubbing

For number inputs with a label, you can **click and drag on the label** to adjust the value by the step amount. This provides a quick way to scrub through numeric values without typing.

### Min / max / step

Number inputs respect `min`, `max`, and `step` constraints:

```html
<wox-input type="number" label="Rotation" value="0" min="-360" max="360" step="1" unit="deg"></wox-input>
```

---

## Examples

### Text input

```html
<wox-input type="text" label="Name" placeholder="Layer name"></wox-input>
```

### Number input with constraints

```html
<wox-input type="number" label="X" value="120" min="0" max="1920" step="1" unit="px"></wox-input>
```

### Compact number grid (common pattern)

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
    <wox-input type="number" label="X" value="100" unit="px"></wox-input>
    <wox-input type="number" label="Y" value="200" unit="px"></wox-input>
    <wox-input type="number" label="W" value="300" unit="px"></wox-input>
    <wox-input type="number" label="H" value="150" unit="px"></wox-input>
</div>
```

### Disabled input

```html
<wox-input type="text" label="ID" value="shape_01" disabled></wox-input>
```

### Event handling

```javascript
const input = document.querySelector('wox-input');

// Live updates (each keystroke)
input.addEventListener('wox-input', (e) => {
    console.log('Typing:', e.detail.value);
});

// Committed value (blur or Enter)
input.addEventListener('wox-change', (e) => {
    console.log('Committed:', e.detail.value);
});
```
