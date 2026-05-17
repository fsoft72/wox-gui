# wox-checkbox

Binary checkbox with custom SVG checkmark and inline clickable label.

**Tag:** `<wox-checkbox>`
**Source:** `src/wox-checkbox.js`
**Class:** `WoxCheckbox`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state (presence attribute) |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Text displayed to the right of the box (clickable, `user-select: none`) |
| `value` | `string` | — | Payload included in `wox-change` event detail |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-change` | `{ checked: boolean, value: string }` | Fired on every toggle |

---

## JS Property

`checkbox.checked` — get/set mirrors the `checked` presence attribute.

```js
const cb = document.querySelector('wox-checkbox');
cb.checked = true;
console.log(cb.checked); // true
```

---

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--wox-checkbox-size` | `14px` | Box width and height |
| `--wox-checkbox-bg` | `var(--wox-bg-input, #1a1a1d)` | Unchecked box background |
| `--wox-checkbox-border` | `var(--wox-border, #333)` | Box border color |
| `--wox-checkbox-checked-bg` | `var(--wox-accent, #00e5ff)` | Checked box background and border |
| `--wox-checkbox-check-color` | `#000` | SVG checkmark stroke color |

---

## Examples

### States

```html
<!-- Basic -->
<wox-checkbox label="Enable shadows"></wox-checkbox>
<wox-checkbox label="Auto-save" checked></wox-checkbox>
<wox-checkbox label="Disabled" disabled></wox-checkbox>
<wox-checkbox label="Disabled checked" checked disabled></wox-checkbox>
```

### No label

```html
<wox-checkbox></wox-checkbox>
<wox-checkbox checked></wox-checkbox>
```

### With value

```html
<wox-checkbox label="Snap to grid" value="snap"></wox-checkbox>
```

### Custom size via CSS variable

```html
<wox-checkbox label="Large" style="--wox-checkbox-size: 18px"></wox-checkbox>
```

### JS property usage

```html
<script>
const cb = document.querySelector('wox-checkbox');
cb.checked = true;
cb.addEventListener('wox-change', e => console.log(e.detail)); // { checked: true, value: '' }
</script>
```
