# wox-date-picker

A calendar date picker component with support for single date selection and date range selection.

**Tag:** `<wox-date-picker>`
**Source:** `src/wox-date-picker.js`
**Class:** `WoxDatePicker`

---

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `range-mode` | `boolean` | `false` | Enable range selection mode (start + end date) |
| `value` | `string` | — | Selected date in `YYYY-MM-DD` format (single mode only) |
| `range-start` | `string` | — | Range start date in `YYYY-MM-DD` format (range mode only) |
| `range-end` | `string` | — | Range end date in `YYYY-MM-DD` format (range mode only) |
| `disabled` | `boolean` | `false` | Disables all interaction (presence attribute) |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wox-change` | `{ date }` | Single mode: emitted when a date is selected |
| `wox-change` | `{ start, end }` | Range mode: emitted when both start and end dates are set |

---

## JavaScript API

### Getters / Setters

| Property | Type | Description |
|----------|------|-------------|
| `rangeMode` | `boolean` | Get or set range selection mode |
| `disabled` | `boolean` | Get or set disabled state |

### Methods

| Method | Description |
|--------|-------------|
| `setDate(dateStr)` | Selects a date in single mode and navigates to its month. `dateStr` is `YYYY-MM-DD`. |
| `setRange(start, end)` | Sets both range endpoints and navigates to the start month. Both args are `YYYY-MM-DD`. |
| `getSelectedDate()` | Returns the selected date string (`YYYY-MM-DD`) or `null` |
| `getSelectedRange()` | Returns `{ start: string|null, end: string|null }` |
| `clear()` | Clears selection and re-renders |

---

## Features

### Single date selection

Click any day cell to select it. The selected date is highlighted with the accent color. A `wox-change` event fires with the selected date.

### Range selection

When `range-mode` is set, click to select the start date, then click again to select the end date. If the second click is before the first, the dates are automatically swapped. A hover preview shows the range as you move the mouse.

### Month / year navigation

- Arrow buttons navigate to the previous or next month
- Year dropdown allows jumping to any year within a 10-year range
- "Today" button navigates to and selects today's date

### Visual indicators

| Indicator | Description |
|-----------|-------------|
| Cyan outline | Today's date |
| Solid cyan background | Selected date (single mode) or range endpoints |
| Translucent cyan fill | Days within the selected range |
| Dimmed cells | Days from adjacent months |

---

## Examples

### Basic date picker

```html
<wox-date-picker></wox-date-picker>
```

### Pre-selected date

```html
<wox-date-picker value="2026-03-15"></wox-date-picker>
```

### Range selection

```html
<wox-date-picker range-mode></wox-date-picker>
```

### Pre-selected range

```html
<wox-date-picker range-mode range-start="2026-03-01" range-end="2026-03-15"></wox-date-picker>
```

### Event handling

```javascript
const picker = document.querySelector('wox-date-picker');

// Single mode
picker.addEventListener('wox-change', (e) => {
    if (e.detail.date) {
        console.log('Selected date:', e.detail.date);
    }
});

// Range mode
picker.addEventListener('wox-change', (e) => {
    if (e.detail.start && e.detail.end) {
        console.log('Range:', e.detail.start, '→', e.detail.end);
    }
});
```

### Programmatic control

```javascript
const picker = document.querySelector('wox-date-picker');

// Set a date
picker.setDate('2026-06-15');

// Switch to range mode and set a range
picker.rangeMode = true;
picker.setRange('2026-03-01', '2026-03-31');

// Read selection
console.log(picker.getSelectedRange()); // { start: '2026-03-01', end: '2026-03-31' }

// Clear everything
picker.clear();
```
