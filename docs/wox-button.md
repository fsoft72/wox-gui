# wox-button

Multi-variant button component supporting icon buttons, text buttons, tile buttons with glow effects, and dash pattern buttons.

**Tag:** `<wox-button>`
**Source:** `src/wox-button.js`
**Class:** `WoxButton`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `string` | `"icon"` | Button style: `"icon"`, `"text"`, `"tile"`, or `"dash"` |
| `icon` | `string` | — | Material Icons name |
| `label` | `string` | — | Button label text |
| `active` | `boolean` | `false` | Active / selected state (presence attribute) |
| `disabled` | `boolean` | `false` | Disabled state (presence attribute) |
| `color` | `string` | — | Custom accent color (used by `tile` variant) |
| `size` | `string` | — | Size override in pixels |
| `dash` | `string` | — | Dash pattern for `dash` variant (see below) |
| `glow` | `boolean` | `false` | Enable animated neon glow effect (`tile` variant with `color`) |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-click` | `{ originalEvent }` | Emitted on click (not emitted when `disabled`) |

---

## Variants

### `"icon"` (default)

A compact 34x32px icon-only button. Ideal for toolbars.

```html
<wox-button variant="icon" icon="near_me"></wox-button>
<wox-button variant="icon" icon="crop_square" active></wox-button>
<wox-button variant="icon" icon="delete" disabled></wox-button>
```

### `"text"`

A compact text button with an optional leading icon.

```html
<wox-button variant="text" label="New"></wox-button>
<wox-button variant="text" icon="add" label="Create"></wox-button>
```

### `"tile"`

A larger button with icon and label, designed for tool palettes and feature grids. Supports custom `color` and animated `glow`.

```html
<!-- Basic tile -->
<wox-button variant="tile" icon="flip_to_front" label="Front"></wox-button>

<!-- Colored tile -->
<wox-button variant="tile" icon="star" label="Favorite" color="#f72585"></wox-button>

<!-- Active tile -->
<wox-button variant="tile" icon="layers" label="Layers" active></wox-button>

<!-- Glow effect -->
<wox-button variant="tile" icon="auto_awesome" label="Magic" color="#00e5ff" glow></wox-button>
```

#### Glow Effect

When the `glow` attribute is present on a `tile` variant with a `color`, the button renders an animated neon glow:

- Pulsing box-shadow
- Text-shadow on the label
- SVG drop-shadow on the icon
- 2-second animation cycle

```html
<wox-button variant="tile" icon="bolt" label="Energy" color="#4cc9f0" glow></wox-button>
<wox-button variant="tile" icon="whatshot" label="Fire" color="#f72585" glow></wox-button>
<wox-button variant="tile" icon="diamond" label="Premium" color="#7209b7" glow></wox-button>
```

### `"dash"`

A 42x26px button displaying a line/dash pattern. Used for stroke style selectors.

| `dash` value | Pattern |
|--------------|---------|
| `"solid"` | Solid line |
| `"dotted"` | Dotted line |
| `"dashed"` | Dashed line |
| `"longdash"` | Long dashes |
| `"dotdash"` | Dot-dash alternating |
| `"zigzag"` | Zigzag line |

```html
<wox-button variant="dash" dash="solid"></wox-button>
<wox-button variant="dash" dash="dashed" active></wox-button>
<wox-button variant="dash" dash="zigzag"></wox-button>
```

---

## Examples

### Toolbar with icon buttons

```html
<wox-toolbar-group label="Select">
    <wox-button variant="icon" icon="near_me" active></wox-button>
    <wox-button variant="icon" icon="open_with"></wox-button>
</wox-toolbar-group>
```

### Action bar with text buttons

```html
<div style="display: flex; gap: 4px;">
    <wox-button variant="text" icon="undo" label="Undo"></wox-button>
    <wox-button variant="text" icon="redo" label="Redo"></wox-button>
    <wox-button variant="text" icon="save" label="Save"></wox-button>
</div>
```

### Feature grid with tile buttons

```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
    <wox-button variant="tile" icon="brush" label="Brush"></wox-button>
    <wox-button variant="tile" icon="format_paint" label="Fill"></wox-button>
    <wox-button variant="tile" icon="gradient" label="Gradient"></wox-button>
</div>
```

### Event handling

```javascript
const btn = document.querySelector('wox-button');
btn.addEventListener('wox-click', (e) => {
    console.log('Button clicked', e.detail.originalEvent);
});
```
