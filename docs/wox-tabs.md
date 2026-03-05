# wox-tabs

A tab container that auto-generates header buttons from child `<wox-tab>` elements and manages active tab visibility.

**Tag:** `<wox-tabs>`
**Source:** `src/wox-tabs.js`
**Class:** `WoxTabs`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `active` | `string` | — | The `name` of the currently active tab |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-tab-change` | `{ name }` | Emitted when a tab header button is clicked |

---

## Slots

| Name | Description |
|------|-------------|
| `default` | `<wox-tab>` children |

---

## Features

### Auto-generated headers

The component reads the `label` attribute from each child `<wox-tab>` and generates corresponding header buttons. No manual header setup is needed.

### Active tab management

Setting the `active` attribute activates the matching tab and deactivates all others. The active tab header shows an accent-colored underline.

---

## Examples

### Basic tab container

```html
<wox-tabs active="general">
    <wox-tab name="general" label="General">
        <p>General settings content</p>
    </wox-tab>
    <wox-tab name="appearance" label="Appearance">
        <p>Appearance settings content</p>
    </wox-tab>
    <wox-tab name="advanced" label="Advanced">
        <p>Advanced settings content</p>
    </wox-tab>
</wox-tabs>
```

### Tab container in a panel

```html
<wox-panel width="300px">
    <wox-tabs active="design">
        <wox-tab name="design" label="Design">
            <wox-section title="Fill">
                <wox-color-swatch color="#00e5ff"></wox-color-swatch>
            </wox-section>
            <wox-section title="Stroke">
                <wox-input type="number" label="Width" value="1" unit="px"></wox-input>
            </wox-section>
        </wox-tab>
        <wox-tab name="prototype" label="Prototype">
            <wox-section title="Interactions">
                <p>Click interactions</p>
            </wox-section>
        </wox-tab>
    </wox-tabs>
</wox-panel>
```

### Programmatic tab switching

```javascript
const tabs = document.querySelector('wox-tabs');

// Switch tab via attribute
tabs.setAttribute('active', 'advanced');

// Listen for tab changes
tabs.addEventListener('wox-tab-change', (e) => {
    console.log('Switched to tab:', e.detail.name);
});
```
