# wox-menu-item

A menu entry component supporting regular items, separators, and section headers. Used inside `<wox-menu>`.

**Tag:** `<wox-menu-item>`
**Source:** `src/wox-menu-item.js`
**Class:** `WoxMenuItem`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Display text for the menu item |
| `shortcut` | `string` | — | Keyboard shortcut hint (e.g. `"Ctrl+N"`, `"Ctrl+Shift+Z"`) |
| `icon` | `string` | — | Material Icons name |
| `disabled` | `boolean` | `false` | Disabled state (presence attribute) |
| `type` | `string` | `"item"` | Entry type: `"item"`, `"separator"`, or `"header"` |
| `submenu` | `boolean` | `false` | Show a right-arrow submenu indicator (presence attribute) |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-select` | `{ label }` | Emitted when a non-disabled item is clicked |

---

## Types

### `"item"` (default)

A regular menu entry with optional icon on the left, label text, and optional keyboard shortcut on the right.

```html
<wox-menu-item label="New File" shortcut="Ctrl+N" icon="add"></wox-menu-item>
```

### `"separator"`

A thin 1px horizontal divider line. No label or icon needed.

```html
<wox-menu-item type="separator"></wox-menu-item>
```

### `"header"`

An uppercase, non-interactive section label for grouping items.

```html
<wox-menu-item type="header" label="Recent Files"></wox-menu-item>
```

---

## Examples

### Complete menu structure

```html
<wox-menu label="File">
    <wox-menu-item label="New" shortcut="Ctrl+N" icon="add"></wox-menu-item>
    <wox-menu-item label="Open" shortcut="Ctrl+O" icon="folder_open"></wox-menu-item>
    <wox-menu-item label="Save" shortcut="Ctrl+S" icon="save"></wox-menu-item>
    <wox-menu-item type="separator"></wox-menu-item>
    <wox-menu-item type="header" label="Export"></wox-menu-item>
    <wox-menu-item label="Export as PNG" shortcut="Ctrl+Shift+P"></wox-menu-item>
    <wox-menu-item label="Export as SVG" shortcut="Ctrl+Shift+S"></wox-menu-item>
    <wox-menu-item type="separator"></wox-menu-item>
    <wox-menu-item label="Preferences" icon="settings" submenu></wox-menu-item>
</wox-menu>
```

### Disabled item

```html
<wox-menu-item label="Paste" shortcut="Ctrl+V" disabled></wox-menu-item>
```

### Submenu indicator

```html
<wox-menu-item label="Transform" submenu></wox-menu-item>
```

### Event handling

```javascript
document.querySelectorAll('wox-menu-item').forEach(item => {
    item.addEventListener('wox-select', (e) => {
        console.log('Selected:', e.detail.label);
    });
});
```
