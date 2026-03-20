# wox-layer-item

A layer panel row component with type icon, name, visibility toggle, lock toggle, and inline rename support.

**Tag:** `<wox-layer-item>`
**Source:** `src/wox-layer-item.js`
**Class:** `WoxLayerItem`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Layer / shape name |
| `type` | `string` | — | Shape type for icon display (see table below) |
| `visible` | `boolean` | `false` | Visibility state (presence attribute) |
| `locked` | `boolean` | `false` | Lock state (presence attribute) |
| `selected` | `boolean` | `false` | Selected / highlighted state (presence attribute) |
| `depth` | `number` | `0` | Nesting depth for indentation: `0`, `1`, or `2` |

### Type Icons

| `type` value | Icon | Description |
|-------------|------|-------------|
| `"rectangle"` | `crop_square` | Rectangle shape |
| `"ellipse"` | `radio_button_unchecked` | Ellipse / circle shape |
| `"path"` | `timeline` | Vector path |
| `"image"` | `image` | Image / bitmap |
| `"text"` | `text_fields` | Text element |
| `"group"` | `folder` | Group container |
| `"layer"` | `layers` | Layer |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-select` | `{ name }` | Emitted when the row is clicked |
| `wox-visibility` | `{ visible }` | Emitted when the eye icon is toggled |
| `wox-lock` | `{ locked }` | Emitted when the lock icon is toggled |

---

## Features

### Inline rename

Double-click the layer name to enter rename mode. An input field replaces the name text. Press Enter or click away to confirm.

### Depth indentation

Nested layers are indented by their depth level:

| `depth` | Left margin |
|---------|-------------|
| `0` | `0` |
| `1` | `24px` |
| `2` | `40px` |

### Visibility toggle

Click the eye icon to toggle visibility. The icon switches between `visibility` (visible) and `visibility_off` (hidden).

### Lock toggle

Click the lock icon to toggle the lock state. The icon switches between `lock` (locked) and `lock_open` (unlocked).

---

## Examples

### Basic layer item

```html
<wox-layer-item name="Background" type="rectangle" visible></wox-layer-item>
```

### Selected and locked

```html
<wox-layer-item name="Logo" type="image" visible locked selected></wox-layer-item>
```

### Nested layer tree

```html
<wox-layer-item name="Page 1" type="layer" visible depth="0"></wox-layer-item>
<wox-layer-item name="Header Group" type="group" visible depth="1"></wox-layer-item>
<wox-layer-item name="Title" type="text" visible depth="2"></wox-layer-item>
<wox-layer-item name="Icon" type="path" visible depth="2"></wox-layer-item>
<wox-layer-item name="Background" type="rectangle" visible locked depth="1"></wox-layer-item>
```

### Event handling

```javascript
const layers = document.querySelectorAll('wox-layer-item');

layers.forEach(layer => {
    layer.addEventListener('wox-select', (e) => {
        // Deselect all, select clicked
        layers.forEach(l => l.removeAttribute('selected'));
        layer.setAttribute('selected', '');
        console.log('Selected layer:', e.detail.name);
    });

    layer.addEventListener('wox-visibility', (e) => {
        console.log('Visibility:', e.detail.visible);
    });

    layer.addEventListener('wox-lock', (e) => {
        console.log('Locked:', e.detail.locked);
    });
});
```
