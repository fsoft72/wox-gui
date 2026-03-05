# wox-menubar

A horizontal menu bar typically placed at the top of the application. Supports keyboard navigation between menus.

**Tag:** `<wox-menubar>`
**Source:** `src/wox-menubar.js`
**Class:** `WoxMenubar`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | `string` | `"32px"` | Menu bar height in CSS units |

---

## Events

None.

---

## Slots

| Name | Description |
|------|-------------|
| `default` | Logo element and `<wox-menu>` children |

---

## Features

### Keyboard navigation

When a menu is open, use **Left** and **Right** arrow keys to move between menus. This automatically closes the current menu and opens the adjacent one.

### Logo area

Place a logo or app name as the first child. It receives a right margin for spacing.

---

## Examples

### Basic menubar

```html
<wox-menubar>
    <wox-menu label="File">
        <wox-menu-item label="New" shortcut="Ctrl+N" icon="add"></wox-menu-item>
        <wox-menu-item label="Open" shortcut="Ctrl+O" icon="folder_open"></wox-menu-item>
        <wox-menu-item label="Save" shortcut="Ctrl+S" icon="save"></wox-menu-item>
    </wox-menu>
    <wox-menu label="Edit">
        <wox-menu-item label="Undo" shortcut="Ctrl+Z"></wox-menu-item>
        <wox-menu-item label="Redo" shortcut="Ctrl+Shift+Z"></wox-menu-item>
        <wox-menu-item type="separator"></wox-menu-item>
        <wox-menu-item label="Cut" shortcut="Ctrl+X"></wox-menu-item>
        <wox-menu-item label="Copy" shortcut="Ctrl+C"></wox-menu-item>
        <wox-menu-item label="Paste" shortcut="Ctrl+V"></wox-menu-item>
    </wox-menu>
</wox-menubar>
```

### Menubar with logo

```html
<wox-menubar height="36px">
    <div class="logo" style="display: flex; align-items: center; gap: 6px; padding: 0 8px;">
        <span style="color: var(--wox-accent); font-size: 18px;">&#9671;</span>
        <span style="font-weight: 600; color: var(--wox-text-hi);">MyApp</span>
    </div>

    <wox-menu label="File">
        <wox-menu-item label="New" shortcut="Ctrl+N"></wox-menu-item>
        <wox-menu-item label="Open" shortcut="Ctrl+O"></wox-menu-item>
    </wox-menu>
    <wox-menu label="Edit">
        <wox-menu-item label="Undo" shortcut="Ctrl+Z"></wox-menu-item>
    </wox-menu>
    <wox-menu label="View">
        <wox-menu-item label="Zoom In" shortcut="Ctrl++"></wox-menu-item>
        <wox-menu-item label="Zoom Out" shortcut="Ctrl+-"></wox-menu-item>
    </wox-menu>
    <wox-menu label="Help">
        <wox-menu-item label="Documentation" icon="description"></wox-menu-item>
        <wox-menu-item label="About" icon="info"></wox-menu-item>
    </wox-menu>
</wox-menubar>
```

### Complete application top bar

```html
<wox-menubar>
    <div style="display: flex; align-items: center; gap: 6px; padding: 0 8px;">
        <span style="color: var(--wox-accent);">&#9671;</span>
        <span style="font-weight: 600;">VectorEditor</span>
    </div>

    <wox-menu label="File">
        <wox-menu-item label="New" shortcut="Ctrl+N" icon="add"></wox-menu-item>
        <wox-menu-item label="Open" shortcut="Ctrl+O" icon="folder_open"></wox-menu-item>
        <wox-menu-item label="Save" shortcut="Ctrl+S" icon="save"></wox-menu-item>
        <wox-menu-item type="separator"></wox-menu-item>
        <wox-menu-item type="header" label="Export"></wox-menu-item>
        <wox-menu-item label="Export as PNG" shortcut="Ctrl+Shift+P"></wox-menu-item>
        <wox-menu-item label="Export as SVG" shortcut="Ctrl+Shift+S"></wox-menu-item>
    </wox-menu>

    <wox-menu label="Edit">
        <wox-menu-item label="Undo" shortcut="Ctrl+Z" icon="undo"></wox-menu-item>
        <wox-menu-item label="Redo" shortcut="Ctrl+Shift+Z" icon="redo"></wox-menu-item>
        <wox-menu-item type="separator"></wox-menu-item>
        <wox-menu-item label="Cut" shortcut="Ctrl+X"></wox-menu-item>
        <wox-menu-item label="Copy" shortcut="Ctrl+C"></wox-menu-item>
        <wox-menu-item label="Paste" shortcut="Ctrl+V"></wox-menu-item>
        <wox-menu-item type="separator"></wox-menu-item>
        <wox-menu-item label="Select All" shortcut="Ctrl+A"></wox-menu-item>
    </wox-menu>

    <wox-menu label="Object">
        <wox-menu-item label="Group" shortcut="Ctrl+G" icon="folder"></wox-menu-item>
        <wox-menu-item label="Ungroup" shortcut="Ctrl+Shift+G"></wox-menu-item>
        <wox-menu-item type="separator"></wox-menu-item>
        <wox-menu-item label="Bring to Front" shortcut="Ctrl+]"></wox-menu-item>
        <wox-menu-item label="Send to Back" shortcut="Ctrl+["></wox-menu-item>
    </wox-menu>

    <wox-menu label="View">
        <wox-menu-item label="Zoom In" shortcut="Ctrl++" icon="zoom_in"></wox-menu-item>
        <wox-menu-item label="Zoom Out" shortcut="Ctrl+-" icon="zoom_out"></wox-menu-item>
        <wox-menu-item label="Fit to Screen" shortcut="Ctrl+0"></wox-menu-item>
        <wox-menu-item type="separator"></wox-menu-item>
        <wox-menu-item label="Toggle Grid" shortcut="Ctrl+'"></wox-menu-item>
        <wox-menu-item label="Toggle Rulers"></wox-menu-item>
    </wox-menu>

    <wox-menu label="Help">
        <wox-menu-item label="Documentation" icon="description"></wox-menu-item>
        <wox-menu-item label="Keyboard Shortcuts" icon="keyboard"></wox-menu-item>
        <wox-menu-item type="separator"></wox-menu-item>
        <wox-menu-item label="About" icon="info"></wox-menu-item>
    </wox-menu>
</wox-menubar>
```
