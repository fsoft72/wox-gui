# wox-statusbar

A horizontal status bar with three content columns (left, center, right), typically placed at the bottom of the application.

**Tag:** `<wox-statusbar>`
**Source:** `src/wox-statusbar.js`
**Class:** `WoxStatusbar`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | `string` | `"24px"` | Status bar height in CSS units |

---

## Events

None.

---

## Slots

| Name | Description |
|------|-------------|
| `left` | Left-aligned content |
| `center` | Center-aligned content |
| `right` | Right-aligned content |

---

## Features

### Three-column layout

The status bar divides into three equal-width columns with left, center, and right alignment respectively.

### Accent background

Uses a subtle cyan accent background tint for visual distinction from the main content area.

---

## Examples

### Basic status bar

```html
<wox-statusbar>
    <span slot="left">Ready</span>
    <span slot="center">Zoom: 100%</span>
    <span slot="right">v1.0.0</span>
</wox-statusbar>
```

### Status with dynamic content

```html
<wox-statusbar height="28px">
    <span slot="left" id="status-msg">Ready</span>
    <span slot="center" id="status-zoom">100%</span>
    <span slot="right" id="status-pos">X: 0  Y: 0</span>
</wox-statusbar>

<script>
    // Update status bar dynamically
    document.getElementById('status-msg').textContent = 'Object selected';
    document.getElementById('status-pos').textContent = 'X: 120  Y: 340';
</script>
```

### Full application layout

```html
<div style="display: flex; flex-direction: column; height: 100vh;">
    <wox-menubar>
        <wox-menu label="File">
            <wox-menu-item label="New"></wox-menu-item>
        </wox-menu>
    </wox-menubar>

    <div style="display: flex; flex: 1;">
        <wox-toolbar>
            <wox-toolbar-group>
                <wox-button variant="icon" icon="near_me" active></wox-button>
            </wox-toolbar-group>
        </wox-toolbar>

        <div style="flex: 1; background: var(--wox-bg-canvas);">
            <!-- Canvas -->
        </div>

        <wox-panel width="280px">
            <wox-section title="Properties">
                <wox-input type="text" label="Name"></wox-input>
            </wox-section>
        </wox-panel>
    </div>

    <wox-statusbar>
        <span slot="left">Ready</span>
        <span slot="center">100%</span>
        <span slot="right">1920 x 1080</span>
    </wox-statusbar>
</div>
```
