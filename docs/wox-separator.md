# wox-separator

A thin divider line for visually separating content. Supports horizontal and vertical orientations.

**Tag:** `<wox-separator>`
**Source:** `src/wox-separator.js`
**Class:** `WoxSeparator`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `direction` | `string` | `"h"` | Orientation: `"h"` (horizontal) or `"v"` (vertical) |
| `spacing` | `string` | — | CSS margin value (e.g. `"8px"`, `"12px"`) applied to both sides |

---

## Events

None.

---

## Examples

### Horizontal separator (default)

```html
<wox-separator></wox-separator>
```

### Horizontal with spacing

```html
<wox-separator spacing="8px"></wox-separator>
```

### Vertical separator

```html
<div style="display: flex; align-items: center; gap: 8px;">
    <wox-button variant="icon" icon="near_me"></wox-button>
    <wox-separator direction="v" spacing="4px"></wox-separator>
    <wox-button variant="icon" icon="crop_square"></wox-button>
</div>
```

---

## Styling Notes

- Uses `--wox-border` for the line color
- Horizontal: full width, 1px height
- Vertical: 1px width, renders inline for use in flex rows
