# wox-toast

Toast notification system with auto-dismiss, progress bar, pause-on-hover, deduplication, and slide animations.

**Tag:** `<wox-toast>`
**Source:** `src/wox-toast.js`
**Class:** `WoxToast`

> This component uses a **static API** -- the element itself is a no-render shell. All functionality is accessed via static methods on the `WoxToast` class.

---

## Static Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `WoxToast.success(msg, opts?)` | `string`, `object` | Show a success toast (green) |
| `WoxToast.error(msg, opts?)` | `string`, `object` | Show an error toast (red) |
| `WoxToast.warning(msg, opts?)` | `string`, `object` | Show a warning toast (orange) |
| `WoxToast.info(msg, opts?)` | `string`, `object` | Show an info toast (blue) |

---

## Options

The optional `opts` object passed to any static method:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `duration` | `number` | `4000` | Auto-dismiss delay in ms. Set to `0` to disable auto-dismiss |
| `closable` | `boolean` | `true` | Show a close button on the toast |
| `position` | `string` | `'BR'` | Screen position code (see below) |

---

## Position Codes

| Code | Description |
|------|-------------|
| `TL` | Top-left |
| `TC` | Top-center |
| `TR` | Top-right |
| `BL` | Bottom-left |
| `BC` | Bottom-center |
| `BR` | Bottom-right |

---

## Features

### Auto-dismiss with progress bar

When `duration` is greater than 0, a progress bar counts down at the bottom of the toast and the toast is automatically dismissed when it reaches zero.

### Pause on hover

Hovering over a toast pauses both the countdown timer and the progress bar animation. The remaining time resumes when the mouse leaves.

### Deduplication

If a toast with the same type and message is already visible, duplicate calls are silently ignored.

### Slide animations

Toasts slide in from the nearest screen edge based on their position code (e.g. bottom-right slides in from the right).

### Collapse on exit

When a toast is dismissed, it first slides out and then collapses its height so remaining toasts shift smoothly into place.

---

## Examples

### Basic toast

```javascript
WoxToast.success('Settings saved!');
```

### Custom position

```javascript
WoxToast.info('New message received', { position: 'TR' });
```

### Persistent toast (no auto-dismiss)

```javascript
WoxToast.error('Connection lost. Retrying...', { duration: 0 });
```

### All types

```javascript
WoxToast.success('File uploaded');
WoxToast.error('Something went wrong');
WoxToast.warning('Disk space is running low');
WoxToast.info('Update available');
```
