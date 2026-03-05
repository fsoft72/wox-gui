# wox-tooltip

A hover-triggered tooltip wrapper that displays informational text near its child content.

**Tag:** `<wox-tooltip>`
**Source:** `src/wox-tooltip.js`
**Class:** `WoxTooltip`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | `string` | — | Tooltip message text |
| `position` | `string` | `"top"` | Tooltip placement: `"top"`, `"bottom"`, `"left"`, or `"right"` |
| `delay` | `number` | — | Show delay in milliseconds (reserved for future use) |

---

## Events

None.

---

## Slots

| Name | Description |
|------|-------------|
| `default` | The element that triggers the tooltip on hover |

---

## Features

### Positioning

The tooltip appears relative to the slotted content:

- `"top"`: Above, centered horizontally
- `"bottom"`: Below, centered horizontally
- `"left"`: To the left, centered vertically
- `"right"`: To the right, centered vertically

### Styling

- Dark background with accent-colored left border
- Smooth opacity transition on show/hide
- Uses `--wox-z-overlay` for stacking

---

## Examples

### Basic tooltip (top)

```html
<wox-tooltip text="Selection Tool (V)">
    <wox-button variant="icon" icon="near_me"></wox-button>
</wox-tooltip>
```

### Tooltip on the right

```html
<wox-tooltip text="Draw Rectangle (R)" position="right">
    <wox-button variant="icon" icon="crop_square"></wox-button>
</wox-tooltip>
```

### Tooltip below

```html
<wox-tooltip text="Click to save" position="bottom">
    <wox-button variant="text" icon="save" label="Save"></wox-button>
</wox-tooltip>
```

### Toolbar with tooltips

```html
<wox-toolbar-group label="Tools">
    <wox-tooltip text="Select (V)" position="right">
        <wox-button variant="icon" icon="near_me" active></wox-button>
    </wox-tooltip>
    <wox-tooltip text="Rectangle (R)" position="right">
        <wox-button variant="icon" icon="crop_square"></wox-button>
    </wox-tooltip>
    <wox-tooltip text="Ellipse (E)" position="right">
        <wox-button variant="icon" icon="circle"></wox-button>
    </wox-tooltip>
</wox-toolbar-group>
```
