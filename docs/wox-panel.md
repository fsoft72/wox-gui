# wox-panel

A side panel container with optional drag-to-resize functionality. Used for properties panels, layer lists, and other sidebar content.

**Tag:** `<wox-panel>`
**Source:** `src/wox-panel.js`
**Class:** `WoxPanel`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | `string` | `"280px"` | Panel width in CSS units |
| `position` | `string` | `"right"` | Side placement: `"left"` or `"right"` |
| `resizable` | `boolean` | `false` | Enable drag-to-resize on the panel edge (presence attribute) |

---

## Events

None.

---

## Slots

| Name | Description |
|------|-------------|
| `default` | Panel content (sections, tabs, layer items, etc.) |

---

## Features

### Resizable

When `resizable` is set, a 5px draggable zone appears on the panel edge. Drag to resize between **180px** (minimum) and **600px** (maximum).

### Position-aware border

- `position="right"` (default): Left border
- `position="left"`: Right border

### Scrollable content

Panel content uses `flex: 1` with `overflow-y: auto` for natural scrolling of long content.

---

## Examples

### Right panel (default)

```html
<wox-panel>
    <wox-section title="Properties">
        <wox-input type="text" label="Name" value="Rectangle 1"></wox-input>
    </wox-section>
</wox-panel>
```

### Resizable left panel

```html
<wox-panel position="left" width="260px" resizable>
    <wox-section title="Layers">
        <wox-layer-item name="Background" type="rectangle" visible></wox-layer-item>
        <wox-layer-item name="Shape 1" type="ellipse" visible selected></wox-layer-item>
    </wox-section>
</wox-panel>
```

### Wide panel with tabs

```html
<wox-panel width="320px" resizable>
    <wox-tabs active="design">
        <wox-tab name="design" label="Design">
            <wox-section title="Fill">
                <wox-color-swatch color="#00e5ff"></wox-color-swatch>
            </wox-section>
            <wox-section title="Stroke">
                <wox-input type="number" label="Width" value="2" unit="px"></wox-input>
            </wox-section>
        </wox-tab>
        <wox-tab name="inspect" label="Inspect">
            <wox-section title="CSS">
                <p style="font-family: var(--wox-font-mono);">width: 300px;</p>
            </wox-section>
        </wox-tab>
    </wox-tabs>
</wox-panel>
```

### Complete layout

```html
<div style="display: flex; height: 100vh;">
    <wox-panel position="left" width="240px" resizable>
        <wox-section title="Layers">
            <wox-layer-item name="Shape 1" type="rectangle" visible selected></wox-layer-item>
        </wox-section>
    </wox-panel>

    <div style="flex: 1; background: var(--wox-bg-canvas);">
        <!-- Canvas -->
    </div>

    <wox-panel position="right" width="280px" resizable>
        <wox-section title="Transform">
            <wox-input type="number" label="X" value="100" unit="px"></wox-input>
            <wox-input type="number" label="Y" value="200" unit="px"></wox-input>
        </wox-section>
    </wox-panel>
</div>
```
