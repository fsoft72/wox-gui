# wox-confirmation-dialog

A modal confirmation dialog that requires an explicit button click to dismiss. Unlike `wox-modal`, clicking outside the overlay or pressing Escape does **not** close it — the user must choose one of the provided buttons.

**Tag:** `<wox-confirmation-dialog>`
**Source:** `src/wox-confirmation-dialog.js`
**Class:** `WoxConfirmationDialog`

---

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | `boolean` | `false` | Show or hide the dialog (presence attribute) |
| `title` | `string` | — | Dialog title text |
| `body` | `string` | — | HTML body content (alternative to slotted children) |
| `width` | `string` | `"400px"` | Max width of the dialog box (min 300px enforced) |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-confirm` | `{ key: string, label: string }` | Fired when any button is clicked |

---

## Slots

| Name | Description |
|------|-------------|
| `default` | Dialog body content (used when the `body` attribute is absent) |

---

## Methods and Properties

| Method / Property | Type | Description |
|-------------------|------|-------------|
| `open()` | method | Sets the `open` attribute |
| `close()` | method | Removes the `open` attribute |
| `openState` | getter/setter | Boolean wrapper around the `open` attribute |
| `buttons` | getter/setter | Array of button config objects (see below) |
| `body` | getter/setter | HTML string for body content |
| `WoxConfirmationDialog.show(opts)` | static method | Create, append, and open a dialog; returns a `Promise<string>` |

---

## Button Config

Each entry in the `buttons` array:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | — | Button text |
| `key` | `string` | — | Identifier emitted in `wox-confirm` detail |
| `color` | `string` | — | CSS background color. Omit to use default styling |
| `textColor` | `string` | `"#fff"` | Text color when `color` is set |

Default buttons (left → right): `[{ label: 'Ok', key: 'ok' }, { label: 'Cancel', key: 'cancel' }]`.

The first button gets accent styling; subsequent buttons get neutral styling.

---

## Examples

### Declarative usage

```html
<wox-confirmation-dialog id="dlg" title="Discard changes?" open>
    <p>All unsaved work will be lost.</p>
</wox-confirmation-dialog>

<script>
    document.getElementById('dlg').addEventListener('wox-confirm', (e) => {
        if (e.detail.key === 'ok') discardChanges();
    });
</script>
```

### Custom buttons with color

```js
const dlg = document.querySelector('wox-confirmation-dialog');
dlg.buttons = [
    { label: 'Delete', key: 'delete', color: 'var(--wox-danger)' },
    { label: 'Cancel', key: 'cancel' },
];
dlg.open();
```

### Static `show()` — Promise API

```js
const key = await WoxConfirmationDialog.show({
    title: 'Delete file?',
    body: '<p>This action <strong>cannot</strong> be undone.</p>',
    buttons: [
        { label: 'Delete', key: 'delete', color: 'var(--wox-danger)' },
        { label: 'Cancel', key: 'cancel' },
    ],
});

if (key === 'delete') performDelete();
```

The dialog is auto-appended to `document.body` and removed after the user clicks a button.

### Programmatic body

```js
const dlg = document.createElement('wox-confirmation-dialog');
dlg.setAttribute('title', 'Replace existing file?');
dlg.body = `<p>A file named <strong>${fileName}</strong> already exists.</p>`;
document.body.appendChild(dlg);
dlg.open();
dlg.addEventListener('wox-confirm', (e) => {
    if (e.detail.key === 'ok') replaceFile();
    dlg.remove();
});
```
