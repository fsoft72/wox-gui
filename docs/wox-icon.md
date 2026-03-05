# wox-icon

Material Icons wrapper component. Renders icons by ligature name with configurable size.

**Tag:** `<wox-icon>`
**Source:** `src/wox-icon.js`
**Class:** `WoxIcon`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Material Icons ligature name (e.g. `"near_me"`, `"layers"`, `"delete"`) |
| `size` | `string \| number` | `18` | Icon size in pixels |

---

## Events

None.

---

## Slots

| Name | Description |
|------|-------------|
| `default` | Fallback SVG content when no `name` is provided |

---

## Examples

### Basic icon

```html
<wox-icon name="near_me"></wox-icon>
```

### Custom size

```html
<wox-icon name="layers" size="32"></wox-icon>
```

### Small icon

```html
<wox-icon name="settings" size="14"></wox-icon>
```

### SVG fallback (no name)

```html
<wox-icon>
    <svg viewBox="0 0 24 24" width="18" height="18">
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>
</wox-icon>
```

---

## Icon Reference

Icons come from Google Material Icons. Browse the full catalog at [fonts.google.com/icons](https://fonts.google.com/icons).

Common icons used in WOX-GUI:

| Name | Description |
|------|-------------|
| `near_me` | Selection cursor |
| `crop_square` | Rectangle tool |
| `circle` | Ellipse tool |
| `timeline` | Pen/path tool |
| `title` | Text tool |
| `pan_tool` | Hand/pan tool |
| `layers` | Layers |
| `visibility` | Visible eye |
| `visibility_off` | Hidden eye |
| `lock` | Locked |
| `lock_open` | Unlocked |
| `add` | Add / create |
| `delete` | Delete |
| `settings` | Settings gear |
| `close` | Close X |
