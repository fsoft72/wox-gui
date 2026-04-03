# wox-input

Input field with optional label, unit display, numeric drag-scrubbing, and a public `value` property for programmatic reads and writes.

**Tag:** `<wox-input>`
**Source:** `src/wox-input.js`
**Class:** `WoxInput`

---

## Supported Types

| Type | Description |
|------|-------------|
| `text` | Standard text input (default) |
| `number` | Numeric input with drag scrubbing, min/max/step |
| `password` | Masked password input |
| `email` | Email address with browser validation |
| `url` | URL with browser validation |
| `tel` | Telephone number input |
| `search` | Search field with clear button |
| `color` | Native color picker |
| `date` | Date picker |
| `time` | Time picker |
| `datetime-local` | Date and time picker |
| `range` | Range slider with min/max/step |

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | `string` | `"text"` | Input type (see table above) |
| `value` | `string` | — | Current input value |
| `label` | `string` | — | Label text displayed above the input |
| `unit` | `string` | — | Unit suffix (e.g. `"px"`, `"%"`, `"deg"`) |
| `placeholder` | `string` | — | Placeholder text |
| `min` | `number` | — | Minimum value (number/range only) |
| `max` | `number` | — | Maximum value (number/range only) |
| `step` | `number` | — | Step increment (number/range only) |
| `disabled` | `boolean` | `false` | Disabled state (presence attribute) |

---

## JavaScript API

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Gets or sets the current input value programmatically |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-input` | `{ value }` | Emitted on every keystroke. In `number`/`range` mode this emits `parseFloat(input.value)` |
| `wox-change` | `{ value }` | Emitted on native change. In practice this fires on blur, and Enter commits by blurring the input |

---

## Features

### Label with unit

When both `label` and `unit` are set, the unit is displayed next to the label text.

```html
<wox-input type="number" label="Width" unit="px" value="100"></wox-input>
```

### Inline unit suffix

When `unit` is set without a `label`, the unit is rendered inside the input on the right side.

```html
<wox-input type="number" value="75" unit="%"></wox-input>
```

### Drag scrubbing

For number inputs with a label, you can **click and drag on the label** to adjust the value by the step amount. This provides a quick way to scrub through numeric values without typing. Scrubbing is disabled when the input is disabled.

### Min / max / step

Number and range inputs respect `min`, `max`, and `step` constraints:

```html
<wox-input type="number" label="Rotation" value="0" min="-360" max="360" step="1" unit="deg"></wox-input>
<wox-input type="range" label="Volume" value="50" min="0" max="100" step="1"></wox-input>
```

---

## Examples

### Text input

```html
<wox-input type="text" label="Name" placeholder="Layer name"></wox-input>
```

### Password input

```html
<wox-input type="password" label="Password" placeholder="Enter password…"></wox-input>
```

### Email input

```html
<wox-input type="email" label="Email" placeholder="user@example.com"></wox-input>
```

### URL input

```html
<wox-input type="url" label="Website" placeholder="https://…"></wox-input>
```

### Telephone input

```html
<wox-input type="tel" label="Phone" placeholder="+1 555 000 0000"></wox-input>
```

### Search input

```html
<wox-input type="search" label="Search" placeholder="Search…"></wox-input>
```

### Color picker

```html
<wox-input type="color" label="Fill Color" value="#00e5ff"></wox-input>
```

### Date input

```html
<wox-input type="date" label="Start Date"></wox-input>
```

### Time input

```html
<wox-input type="time" label="Start Time"></wox-input>
```

### Datetime-local input

```html
<wox-input type="datetime-local" label="Event Date"></wox-input>
```

### Range input

```html
<wox-input type="range" label="Volume" value="50" min="0" max="100" step="1"></wox-input>
```

### Number input with constraints

```html
<wox-input type="number" label="X" value="120" min="0" max="1920" step="1" unit="px"></wox-input>
```

### Unit-only compact input

```html
<wox-input type="number" value="12" unit="px"></wox-input>
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

### Programmatic value access

```javascript
const input = document.querySelector('wox-input');

input.value = '256';
console.log(input.value);
```

---

## Notes

- In `number`/`range` mode, event payloads use `parseFloat(input.value)`, so an empty or invalid numeric field can emit `NaN`
- Numeric inputs are right-aligned in the current implementation
- `color` and `range` types ignore the `unit` attribute
- `date`, `time`, and `datetime-local` use `color-scheme: dark` for native picker integration
- Invalid type values fall back to `"text"`
