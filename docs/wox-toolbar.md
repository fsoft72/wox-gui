# wox-toolbar

A vertical toolbar container, typically placed on the left or right side of the application layout.

**Tag:** `<wox-toolbar>`
**Source:** `src/wox-toolbar.js`
**Class:** `WoxToolbar`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | `string` | `"44px"` | Toolbar width in CSS units |
| `position` | `string` | `"left"` | Side placement: `"left"` or `"right"` |

---

## Events

None.

---

## Slots

| Name | Description |
|------|-------------|
| `default` | `<wox-toolbar-group>` children |

---

## Features

### Fixed width

The toolbar uses `flex-shrink: 0` to maintain its width in flex layouts, preventing it from collapsing.

### Position-aware border

- `position="left"` (default): Right border
- `position="right"`: Left border

---

## Examples

### Left toolbar (default)

```html
<wox-toolbar>
    <wox-toolbar-group label="Select">
        <wox-button variant="icon" icon="near_me" active></wox-button>
        <wox-button variant="icon" icon="open_with"></wox-button>
    </wox-toolbar-group>
    <wox-toolbar-group label="Draw">
        <wox-button variant="icon" icon="crop_square"></wox-button>
        <wox-button variant="icon" icon="circle"></wox-button>
    </wox-toolbar-group>
</wox-toolbar>
```

### Right toolbar

```html
<wox-toolbar position="right" width="48px">
    <wox-toolbar-group>
        <wox-button variant="icon" icon="zoom_in"></wox-button>
        <wox-button variant="icon" icon="zoom_out"></wox-button>
    </wox-toolbar-group>
</wox-toolbar>
```

### Full editor layout

```html
<div style="display: flex; height: 100vh;">
    <wox-toolbar>
        <wox-toolbar-group label="Tools">
            <wox-button variant="icon" icon="near_me" active></wox-button>
            <wox-button variant="icon" icon="crop_square"></wox-button>
        </wox-toolbar-group>
    </wox-toolbar>

    <div style="flex: 1; background: var(--wox-bg-canvas);">
        <!-- Canvas area -->
    </div>

    <wox-panel position="right" width="280px">
        <!-- Properties panel -->
    </wox-panel>
</div>
```
