# wox-datagrid

A sortable data grid with resizable columns, row hover effects, and odd/even row striping. Data is provided via JavaScript properties.

**Tag:** `<wox-datagrid>`
**Source:** `src/wox-datagrid.js`
**Class:** `WoxDatagrid`

---

## Properties

Data is set via JavaScript, not HTML attributes:

### `columns` (JavaScript property)

An array of column definition objects:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `key` | `string` | — | Field name matching keys in row objects (required) |
| `label` | `string` | `key` | Header display text |
| `width` | `number` | `120` | Initial column width in pixels |
| `align` | `string` | `"left"` | Cell alignment: `"left"`, `"center"`, or `"right"` |
| `sortable` | `boolean` | `true` | Whether the column can be sorted by clicking the header |

### `rows` (JavaScript property)

An array of plain objects. Each object's keys should match the column `key` values.

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-sort` | `{ key, direction }` | Emitted when sort changes. `direction` is `"asc"` or `"desc"` |
| `wox-row-click` | `{ row, index }` | Emitted when a row is clicked. `row` is the data object, `index` is the visual row index |

---

## Features

### Column sorting

Click a column header to sort ascending. Click again to toggle to descending. The active sort column header turns accent-colored with an arrow indicator.

- Numbers are sorted numerically
- Strings are sorted with `localeCompare`
- `null` / `undefined` values sort to the end

### Column resizing

Drag the right edge of any column header to resize it. A 5px handle zone is provided. Minimum column width is 40px. The handle highlights with the accent color on hover and during drag.

### Row striping

Even rows use `--wox-bg-panel` and odd rows use `--wox-bg-toolbar` for a subtle alternating pattern.

### Row hover

Rows highlight with `--wox-bg-hover` on mouse over.

### Scrollable body

The header stays fixed while the body scrolls vertically for long data sets.

### Empty state

When no rows are provided, a centered "No data" message is displayed.

---

## Examples

### Basic usage

```html
<wox-datagrid id="my-grid" style="height: 300px;"></wox-datagrid>

<script type="module">
    const grid = document.getElementById('my-grid');

    grid.columns = [
        { key: 'name', label: 'Name', width: 200 },
        { key: 'type', label: 'Type', width: 120 },
        { key: 'size', label: 'Size (KB)', width: 100, align: 'right' },
    ];

    grid.rows = [
        { name: 'hero-banner.svg', type: 'SVG',   size: 24 },
        { name: 'logo.png',        type: 'Image', size: 1024 },
        { name: 'icons.svg',       type: 'SVG',   size: 48 },
        { name: 'background.jpg',  type: 'Image', size: 3200 },
    ];
</script>
```

### With non-sortable column

```javascript
grid.columns = [
    { key: 'id',   label: '#',    width: 40, align: 'center', sortable: false },
    { key: 'name', label: 'Name', width: 200 },
    { key: 'role', label: 'Role', width: 150 },
];
```

### Listening for events

```javascript
const grid = document.querySelector('wox-datagrid');

grid.addEventListener('wox-sort', (e) => {
    console.log(`Sorted by ${e.detail.key} ${e.detail.direction}`);
});

grid.addEventListener('wox-row-click', (e) => {
    console.log('Clicked row:', e.detail.row);
    console.log('Row index:', e.detail.index);
});
```

### Updating data dynamically

```javascript
// Replace all rows
grid.rows = newData;

// Change columns (resets sort state)
grid.columns = newColumnDefs;
```

### Inside a panel

```html
<wox-panel width="600px">
    <wox-section title="Assets">
        <wox-datagrid id="assets-grid" style="height: 200px;"></wox-datagrid>
    </wox-section>
</wox-panel>
```

---

## Styling Notes

- The grid uses these theme variables: `--wox-bg-panel`, `--wox-bg-toolbar`, `--wox-bg-hover`, `--wox-bg-section-header`, `--wox-border`, `--wox-border-section`, `--wox-border-light`, `--wox-accent`, `--wox-text-primary`, `--wox-text-secondary`, `--wox-text-hi`
- Set a fixed `height` on the element for the scrollable body to work
- The component uses `display: block` by default and fills its container width
