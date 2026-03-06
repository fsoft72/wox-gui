# wox-select

Searchable, single or multi-select dropdown with keyboard navigation and optional per-option images.

**Tag:** `<wox-select>`
**Source:** `src/wox-select.js`
**Class:** `WoxSelect`

---

## Properties

| Attribute     | Type      | Default              | Description                                      |
|---------------|-----------|----------------------|--------------------------------------------------|
| `multiple`    | `boolean` | `false`              | Multi-select mode: shows tag chips               |
| `searchable`  | `boolean` | `false`              | Shows a search input inside the dropdown         |
| `placeholder` | `string`  | `"Select an option"` | Placeholder when nothing is selected             |
| `disabled`    | `boolean` | `false`              | Disables the component                           |
| `value`       | `string`  | `""`                 | Selected value (JS property only for setting)    |
| `options`     | `string`  | `"[]"`               | JSON array of `{ value, label, image? }` objects |

---

## Events

| Event        | Detail          | Description                     |
|--------------|-----------------|---------------------------------|
| `wox-change` | `{ value }`     | Fires on selection change       |
| `wox-open`   | —               | Fires when the dropdown opens   |
| `wox-close`  | —               | Fires when the dropdown closes  |
| `wox-search` | `{ query }`     | Fires on search input change    |

---

## Methods

| Method                      | Description                                      |
|-----------------------------|--------------------------------------------------|
| `open()`                    | Opens the dropdown                               |
| `close()`                   | Closes the dropdown                              |
| `toggle()`                  | Toggles open/closed                              |
| `selectOption(value)`       | Programmatically selects an option by value      |
| `deselectOption(value)`     | Programmatically deselects an option by value    |
| `getSelectedOptions()`      | Returns array of selected option objects         |
| `setOptions(options)`       | Replaces all options and clears the selection    |

---

## Option Format

Each option in the `options` array is an object:

```js
{ value: string, label: string, image?: string }
```

`image` is an optional URL for an avatar-style thumbnail (displayed as a 20px circle).

---

## Examples

### Single select

```html
<wox-select id="my-select" placeholder="Choose a fruit"></wox-select>
<script type="module">
    document.getElementById('my-select').setOptions([
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
    ]);
</script>
```

### Searchable

```html
<wox-select searchable placeholder="Search countries..."></wox-select>
```

### Multi-select

```html
<wox-select multiple placeholder="Pick tags..."></wox-select>
```

### With images

```html
<wox-select id="user-select" placeholder="Choose user"></wox-select>
<script type="module">
    document.getElementById('user-select').setOptions([
        { value: 'alice', label: 'Alice', image: 'https://example.com/alice.jpg' },
        { value: 'bob',   label: 'Bob',   image: 'https://example.com/bob.jpg' },
    ]);
</script>
```

### Event handling

```javascript
const sel = document.querySelector('wox-select');

sel.addEventListener('wox-change', (e) => {
    console.log('Selected:', e.detail.value);
});

sel.addEventListener('wox-search', (e) => {
    console.log('Searching for:', e.detail.query);
});
```

### Setting options via attribute (HTML)

```html
<wox-select options='[{"value":"a","label":"Alpha"},{"value":"b","label":"Beta"}]'></wox-select>
```

---

## Keyboard Navigation

| Key         | Behavior                                          |
|-------------|---------------------------------------------------|
| `ArrowDown` | Opens dropdown / moves focus down                 |
| `ArrowUp`   | Moves focus up / returns focus to search input    |
| `Enter`     | Selects the focused option / opens if closed      |
| `Escape`    | Closes the dropdown                               |
| `Tab`       | Closes the dropdown                               |
