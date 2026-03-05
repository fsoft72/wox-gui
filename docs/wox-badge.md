# wox-badge

Small indicator badge with dot, diamond, and text variants. Used for status indicators, labels, and visual markers.

**Tag:** `<wox-badge>`
**Source:** `src/wox-badge.js`
**Class:** `WoxBadge`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `string` | `"dot"` | Badge style: `"dot"`, `"diamond"`, or `"text"` |
| `text` | `string` | — | Label text (only used with `variant="text"`) |
| `color` | `string` | `var(--wox-accent)` | CSS color value for the badge |

---

## Events

None.

---

## Variants

### `"dot"` (default)

A small 8x8 filled circle with a subtle accent glow.

```html
<wox-badge></wox-badge>
<wox-badge color="#f72585"></wox-badge>
<wox-badge color="#4361ee"></wox-badge>
```

### `"diamond"`

An 8x8 rotated square with an accent glow.

```html
<wox-badge variant="diamond"></wox-badge>
<wox-badge variant="diamond" color="#f72585"></wox-badge>
```

### `"text"`

An uppercase text label with a colored background pill.

```html
<wox-badge variant="text" text="Rectangle" color="#4361ee"></wox-badge>
<wox-badge variant="text" text="Active" color="#00e5ff"></wox-badge>
<wox-badge variant="text" text="Error" color="#f72585"></wox-badge>
```

---

## Examples

### Status indicators

```html
<div style="display: flex; align-items: center; gap: 8px;">
    <wox-badge color="#4cc9f0"></wox-badge>
    <span>Online</span>
</div>

<div style="display: flex; align-items: center; gap: 8px;">
    <wox-badge color="#f72585"></wox-badge>
    <span>Offline</span>
</div>
```

### Layer type labels

```html
<wox-badge variant="text" text="Path" color="#7209b7"></wox-badge>
<wox-badge variant="text" text="Group" color="#4361ee"></wox-badge>
<wox-badge variant="text" text="Image" color="#4cc9f0"></wox-badge>
```
