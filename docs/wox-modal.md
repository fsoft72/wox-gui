# wox-modal

A dialog overlay component with backdrop, scale-in animation, escape-to-close, and customizable footer actions.

**Tag:** `<wox-modal>`
**Source:** `src/wox-modal.js`
**Class:** `WoxModal`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | `boolean` | `false` | Show or hide the modal (presence attribute) |
| `title` | `string` | — | Dialog title text |
| `closable` | `boolean` | `true` | Show the close (x) button in the top-right corner (presence attribute) |
| `width` | `string` | `"400px"` | Maximum width of the dialog |
| `color` | `string` | — | Custom color for glow/pulse border effects |
| `glow` | `boolean` | `false` | Enable neon glow on the dialog box |
| `pulse` | `boolean` | `false` | Enable opacity pulse on the dialog. Composable with `glow`. |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-close` | — | Emitted when closed via close button, Escape key, or backdrop click |
| `wox-confirm` | — | Emitted when the default OK button is clicked |
| `wox-cancel` | — | Emitted when the default Cancel button is clicked |

---

## Slots

| Name | Description |
|------|-------------|
| `default` | Dialog body content |
| `footer` | Custom footer buttons (replaces default Cancel/OK) |

---

## Features

### Backdrop

A dark semi-transparent overlay with a 2px blur effect covers the entire viewport.

### Scale-in animation

The dialog scales from 0.95 to 1.0 with a fade-in effect when opened.

### Escape to close

Pressing the **Escape** key closes the modal and emits `wox-close`.

### Backdrop click to close

Clicking outside the dialog (on the backdrop) closes the modal.

### Default footer

If no `footer` slot content is provided, the modal renders default **Cancel** and **OK** buttons.

---

### Glow & Pulse Effects

When `glow` is present with a `color`, the dialog box renders with an animated neon glow border. `pulse` adds an opacity pulse.

```html
<!-- Neon glow dialog -->
<wox-modal open title="Neon Dialog" color="#4cc9f0" glow>
    <p>This dialog has a glowing border.</p>
</wox-modal>

<!-- Glow + Pulse -->
<wox-modal open title="Alert" color="#f72585" glow pulse>
    <p>Critical warning with animated border.</p>
</wox-modal>
```

---

## Examples

### Basic confirmation dialog

```html
<wox-modal open title="Confirm Action">
    <p>Are you sure you want to proceed?</p>
</wox-modal>
```

### Custom footer buttons

```html
<wox-modal open title="Delete Item" width="350px">
    <p>This action cannot be undone. The item will be permanently deleted.</p>

    <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="cancel-btn"
            style="padding: 6px 16px; background: var(--wox-bg-hover); color: var(--wox-text-primary); border: 1px solid var(--wox-border); border-radius: 4px; cursor: pointer;">
            Cancel
        </button>
        <button id="delete-btn"
            style="padding: 6px 16px; background: var(--wox-danger); color: white; border: none; border-radius: 4px; cursor: pointer;">
            Delete
        </button>
    </div>
</wox-modal>
```

### Wide dialog with form

```html
<wox-modal open title="New Project" width="500px">
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 8px 0;">
        <wox-input type="text" label="Project Name" placeholder="My Project"></wox-input>
        <wox-input type="number" label="Canvas Width" value="1920" unit="px"></wox-input>
        <wox-input type="number" label="Canvas Height" value="1080" unit="px"></wox-input>
    </div>
</wox-modal>
```

### Non-closable modal

```html
<wox-modal open title="Processing...">
    <p>Please wait while your file is being exported.</p>
    <!-- No close button, no escape, no backdrop dismiss -->
</wox-modal>
```

Note: Remove the `closable` attribute to hide the close button. However, Escape and backdrop click still work by default.

### Event handling

```javascript
const modal = document.querySelector('wox-modal');
const openBtn = document.getElementById('open-modal');

// Open the modal
openBtn.addEventListener('click', () => {
    modal.setAttribute('open', '');
});

// Handle confirm (default OK button)
modal.addEventListener('wox-confirm', () => {
    console.log('User confirmed');
    modal.removeAttribute('open');
});

// Handle cancel (default Cancel button)
modal.addEventListener('wox-cancel', () => {
    console.log('User cancelled');
    modal.removeAttribute('open');
});

// Handle any close (X button, Escape, backdrop)
modal.addEventListener('wox-close', () => {
    console.log('Modal closed');
    modal.removeAttribute('open');
});
```

### Programmatic open/close

```javascript
const modal = document.querySelector('wox-modal');

// Open
modal.setAttribute('open', '');

// Close
modal.removeAttribute('open');
```
