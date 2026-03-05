# wox-menu

A dropdown menu component with click, hover, or context trigger modes. Automatically flips position to stay within the viewport.

**Tag:** `<wox-menu>`
**Source:** `src/wox-menu.js`
**Class:** `WoxMenu`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Trigger button label text |
| `open` | `boolean` | `false` | Show or hide the dropdown (presence attribute) |
| `trigger` | `string` | `"click"` | Trigger mode: `"click"`, `"hover"`, or `"context"` |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-open` | — | Emitted when the menu opens |
| `wox-close` | — | Emitted when the menu closes |

Child `<wox-menu-item>` `wox-select` events propagate through the menu.

---

## Slots

| Name | Description |
|------|-------------|
| `default` | `<wox-menu-item>` children |

---

## Features

### Trigger modes

- **`"click"`** (default): Opens on click, closes on outside click or item selection
- **`"hover"`**: Opens on mouse enter, closes on mouse leave (with a 10px invisible bridge to prevent accidental closing)
- **`"context"`**: For use as a context menu (right-click)

### Viewport flipping

If the dropdown would extend past the right or bottom edge of the viewport, it automatically repositions to stay visible.

### Auto-close

The menu closes automatically when:
- A `<wox-menu-item>` is clicked (emits `wox-select`)
- The user clicks outside the menu
- The user moves to another menu in a `<wox-menubar>`

---

## Examples

### Basic dropdown (click trigger)

```html
<wox-menu label="File">
    <wox-menu-item label="New" shortcut="Ctrl+N" icon="add"></wox-menu-item>
    <wox-menu-item label="Open" shortcut="Ctrl+O" icon="folder_open"></wox-menu-item>
    <wox-menu-item type="separator"></wox-menu-item>
    <wox-menu-item label="Save" shortcut="Ctrl+S" icon="save"></wox-menu-item>
</wox-menu>
```

### Hover trigger

```html
<wox-menu label="Help" trigger="hover">
    <wox-menu-item label="Documentation" icon="description"></wox-menu-item>
    <wox-menu-item label="About" icon="info"></wox-menu-item>
</wox-menu>
```

### Inside a menubar

```html
<wox-menubar>
    <wox-menu label="File">
        <wox-menu-item label="New" shortcut="Ctrl+N"></wox-menu-item>
        <wox-menu-item label="Open" shortcut="Ctrl+O"></wox-menu-item>
    </wox-menu>
    <wox-menu label="Edit">
        <wox-menu-item label="Undo" shortcut="Ctrl+Z"></wox-menu-item>
        <wox-menu-item label="Redo" shortcut="Ctrl+Shift+Z"></wox-menu-item>
    </wox-menu>
</wox-menubar>
```

### Event handling

```javascript
const menu = document.querySelector('wox-menu');

menu.addEventListener('wox-open', () => {
    console.log('Menu opened');
});

menu.addEventListener('wox-close', () => {
    console.log('Menu closed');
});

// Listen for item selections via bubbling
menu.addEventListener('wox-select', (e) => {
    console.log('Selected:', e.detail.label);
});
```
