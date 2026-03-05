# wox-section

A collapsible panel section with a dark header, expand/collapse toggle, and optional header actions.

**Tag:** `<wox-section>`
**Source:** `src/wox-section.js`
**Class:** `WoxSection`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | `string` | — | Section title text |
| `collapsed` | `boolean` | `false` | Collapsed state (presence attribute) |
| `icon` | `string` | — | Material Icons name (optional) |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-toggle` | `{ collapsed }` | Emitted when the section header is clicked |

---

## Slots

| Name | Description |
|------|-------------|
| `default` | Section body content |
| `header-actions` | Right-side header actions (buttons, badges, etc.) |

---

## Features

### Collapse / Expand

Click the header to toggle between collapsed and expanded states. The chevron rotates -90 degrees when collapsed. Body content is hidden with `display: none`.

### Diamond accent

The header displays a small diamond icon on the left as a visual accent marker.

### Section shadow

The body has a subtle bottom gradient shadow (`--wox-shadow-section`) for visual depth.

---

## Examples

### Basic section

```html
<wox-section title="Appearance">
    <wox-slider value="100" label="Opacity" unit="%" show-value></wox-slider>
    <wox-input type="text" label="Blend Mode" value="Normal"></wox-input>
</wox-section>
```

### Collapsed by default

```html
<wox-section title="Advanced" collapsed>
    <p>Advanced settings here</p>
</wox-section>
```

### Header actions

```html
<wox-section title="Layers">
    <template slot="header-actions">
        <wox-button variant="icon" icon="add" size="16"></wox-button>
        <wox-button variant="icon" icon="delete" size="16"></wox-button>
    </template>

    <wox-layer-item name="Background" type="rectangle" visible></wox-layer-item>
    <wox-layer-item name="Foreground" type="path" visible></wox-layer-item>
</wox-section>
```

### Properties panel pattern

```html
<wox-panel width="280px">
    <wox-section title="Transform">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <wox-input type="number" label="X" value="100" unit="px"></wox-input>
            <wox-input type="number" label="Y" value="200" unit="px"></wox-input>
            <wox-input type="number" label="W" value="300" unit="px"></wox-input>
            <wox-input type="number" label="H" value="150" unit="px"></wox-input>
        </div>
    </wox-section>

    <wox-section title="Fill">
        <wox-color-swatch color="#00e5ff"></wox-color-swatch>
    </wox-section>

    <wox-section title="Stroke" collapsed>
        <wox-input type="number" label="Width" value="1" unit="px"></wox-input>
    </wox-section>
</wox-panel>
```

### Event handling

```javascript
const section = document.querySelector('wox-section');
section.addEventListener('wox-toggle', (e) => {
    console.log('Section collapsed:', e.detail.collapsed);
});
```
