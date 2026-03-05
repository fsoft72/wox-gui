# wox-toolbar-group

A vertical button group for use inside `<wox-toolbar>`. Visually separates groups with a top border and an optional label.

**Tag:** `<wox-toolbar-group>`
**Source:** `src/wox-toolbar-group.js`
**Class:** `WoxToolbarGroup`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Optional uppercase label displayed below the group |

---

## Events

None.

---

## Slots

| Name | Description |
|------|-------------|
| `default` | Button children (typically `<wox-button variant="icon">`) |

---

## Examples

### Basic tool group

```html
<wox-toolbar-group>
    <wox-button variant="icon" icon="near_me" active></wox-button>
    <wox-button variant="icon" icon="open_with"></wox-button>
</wox-toolbar-group>
```

### Labeled group

```html
<wox-toolbar-group label="Draw">
    <wox-button variant="icon" icon="crop_square"></wox-button>
    <wox-button variant="icon" icon="circle"></wox-button>
    <wox-button variant="icon" icon="timeline"></wox-button>
</wox-toolbar-group>
```

### Full toolbar with groups

```html
<wox-toolbar>
    <wox-toolbar-group label="Select">
        <wox-button variant="icon" icon="near_me" active></wox-button>
        <wox-button variant="icon" icon="open_with"></wox-button>
    </wox-toolbar-group>

    <wox-toolbar-group label="Shape">
        <wox-button variant="icon" icon="crop_square"></wox-button>
        <wox-button variant="icon" icon="circle"></wox-button>
        <wox-button variant="icon" icon="timeline"></wox-button>
    </wox-toolbar-group>

    <wox-toolbar-group label="Edit">
        <wox-button variant="icon" icon="title"></wox-button>
        <wox-button variant="icon" icon="pan_tool"></wox-button>
    </wox-toolbar-group>
</wox-toolbar>
```
