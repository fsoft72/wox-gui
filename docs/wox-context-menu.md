# wox-context-menu

Singleton right-click context menu with icons, keyboard shortcuts, and viewport clamping.

**Tag:** `<wox-context-menu>`
**Source:** `src/wox-context-menu.js`
**Class:** `WoxContextMenu`

> This component uses a **static API** -- the element itself is a no-render shell. All functionality is accessed via static methods on the `WoxContextMenu` class.

---

## Static Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `WoxContextMenu.show(event, items)` | `MouseEvent`, `Array<Item>` | Show the menu at the pointer position |
| `WoxContextMenu.hide()` | -- | Dismiss the menu |

---

## Item Properties

Each object in the `items` array can have the following properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | -- | Display text for the menu entry |
| `icon` | `string` | -- | Material Icons ligature (e.g. `'content_cut'`) |
| `action` | `Function` | -- | Callback invoked when the item is clicked |
| `disabled` | `boolean` | `false` | Grayed out, click ignored |
| `divider` | `boolean` | `false` | Renders a horizontal separator instead of a menu item |
| `shortcut` | `string` | -- | Right-aligned keyboard shortcut hint (e.g. `'Ctrl+X'`) |

---

## Features

### Singleton pattern

Only one context menu exists at a time. Calling `show()` again replaces the previous menu content.

### Viewport clamping

If the menu overflows the viewport edge, it automatically repositions to stay within the visible area.

### Dismiss on Escape or outside click

The menu closes when the user presses Escape or clicks anywhere outside of it.

### Material Icons support

Item icons use Material Icons ligatures. Include the Material Icons font in your page for icon rendering.

---

## Examples

### Basic context menu

```javascript
document.addEventListener('contextmenu', (e) => {
    WoxContextMenu.show(e, [
        { label: 'Copy',  action: () => copy() },
        { label: 'Paste', action: () => paste() },
    ]);
});
```

### With icons and shortcuts

```javascript
canvas.addEventListener('contextmenu', (e) => {
    WoxContextMenu.show(e, [
        { label: 'Cut',   icon: 'content_cut',   shortcut: 'Ctrl+X', action: () => cut() },
        { label: 'Copy',  icon: 'content_copy',  shortcut: 'Ctrl+C', action: () => copy() },
        { label: 'Paste', icon: 'content_paste',  shortcut: 'Ctrl+V', action: () => paste() },
        { divider: true },
        { label: 'Delete', icon: 'delete', shortcut: 'Del', action: () => remove() },
    ]);
});
```

### Disabled items

```javascript
WoxContextMenu.show(e, [
    { label: 'Undo', icon: 'undo', action: () => undo() },
    { label: 'Redo', icon: 'redo', action: () => redo(), disabled: true },
]);
```
