# wox-tab

An individual tab panel, designed to be used inside a `<wox-tabs>` container. Visibility is managed by the parent.

**Tag:** `<wox-tab>`
**Source:** `src/wox-tab.js`
**Class:** `WoxTab`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique tab identifier (used by parent `<wox-tabs>`) |
| `label` | `string` | — | Display label shown in the tab header |
| `icon` | `string` | — | Material Icons name for the tab header |
| `active` | `boolean` | `false` | Active / visible state (managed by parent `<wox-tabs>`) |

---

## Events

None (tab switching is handled by `<wox-tabs>`).

---

## Features

### Visibility

- Hidden (`display: none`) by default
- Shown (`display: flex`) when the `active` attribute is present
- The parent `<wox-tabs>` manages which tab is active

### Scrollable content

Tab content uses `flex: 1` with `overflow-y: auto`, making it naturally scrollable for long content.

---

## Examples

### Usage inside wox-tabs

```html
<wox-tabs active="design">
    <wox-tab name="design" label="Design">
        <wox-section title="Fill">
            <wox-color-swatch color="#00e5ff"></wox-color-swatch>
        </wox-section>
    </wox-tab>

    <wox-tab name="prototype" label="Prototype">
        <p>Prototype settings</p>
    </wox-tab>

    <wox-tab name="inspect" label="Inspect">
        <p>Inspect panel</p>
    </wox-tab>
</wox-tabs>
```

> **Note:** Always use `<wox-tab>` inside a `<wox-tabs>` parent. See [wox-tabs](./wox-tabs.md) for the complete usage pattern.
