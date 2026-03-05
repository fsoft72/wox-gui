# Getting Started

WOX-GUI is a zero-dependency Web Component library that requires no build step. Import the ES modules directly in your HTML.

---

## Setup

### 1. Include Required Fonts

WOX-GUI uses **Inter** for UI text and **Material Icons** for iconography. Add these to your document `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

### 2. Include the Theme

Load the CSS custom properties theme file:

```html
<link rel="stylesheet" href="css/wox-theme.css">
```

### 3. Import Components

Import all components at once:

```html
<script type="module" src="src/index.js"></script>
```

Or import individual components as needed:

```html
<script type="module">
    import { WoxButton, WoxInput } from './src/index.js';
</script>
```

---

## Minimal Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WOX-GUI Demo</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Theme -->
    <link rel="stylesheet" href="css/wox-theme.css">

    <!-- Components -->
    <script type="module" src="src/index.js"></script>

    <style>
        body {
            margin: 0;
            background: var(--wox-bg-app);
            color: var(--wox-text-primary);
            font-family: var(--wox-font);
        }
        .demo {
            padding: 24px;
            display: flex;
            gap: 12px;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="demo">
        <wox-button variant="icon" icon="near_me"></wox-button>
        <wox-input type="text" label="Name" placeholder="Enter a name"></wox-input>
        <wox-slider value="50" label="Opacity" unit="%" show-value></wox-slider>
    </div>

    <script type="module">
        document.querySelector('wox-button').addEventListener('wox-click', () => {
            console.log('Button clicked!');
        });
    </script>
</body>
</html>
```

---

## Event Handling

All WOX-GUI components emit custom events with the `wox-` prefix. Events bubble through the DOM with `composed: true`, so they cross Shadow DOM boundaries.

```javascript
// Listen for events on individual components
const input = document.querySelector('wox-input');
input.addEventListener('wox-change', (e) => {
    console.log('New value:', e.detail.value);
});

// Or use event delegation on a parent
document.querySelector('.panel').addEventListener('wox-click', (e) => {
    console.log('A button was clicked:', e.target);
});
```

---

## Setting Attributes

Configure components through HTML attributes or JavaScript:

```html
<!-- HTML attributes -->
<wox-button variant="tile" icon="star" label="Favorite" active></wox-button>
```

```javascript
// JavaScript property/attribute setting
const btn = document.querySelector('wox-button');
btn.setAttribute('icon', 'delete');
btn.setAttribute('active', '');    // boolean: set to enable
btn.removeAttribute('active');     // boolean: remove to disable
```

Boolean attributes (like `active`, `disabled`, `open`) are toggled by their presence or absence -- the value does not matter.

---

## Project Structure

```
wox-gui/
  css/
    wox-theme.css        # CSS custom properties (theme)
  src/
    wox-base.js          # WoxElement base class
    wox-icon.js          # <wox-icon>
    wox-separator.js     # <wox-separator>
    wox-badge.js         # <wox-badge>
    wox-button.js        # <wox-button>
    wox-input.js         # <wox-input>
    wox-slider.js        # <wox-slider>
    wox-color-swatch.js  # <wox-color-swatch>
    wox-tooltip.js       # <wox-tooltip>
    wox-color-picker.js  # <wox-color-picker>
    wox-menu-item.js     # <wox-menu-item>
    wox-menu.js          # <wox-menu>
    wox-layer-item.js    # <wox-layer-item>
    wox-section.js       # <wox-section>
    wox-tab.js           # <wox-tab>
    wox-tabs.js          # <wox-tabs>
    wox-toolbar-group.js # <wox-toolbar-group>
    wox-toolbar.js       # <wox-toolbar>
    wox-panel.js         # <wox-panel>
    wox-menubar.js       # <wox-menubar>
    wox-statusbar.js     # <wox-statusbar>
    wox-modal.js         # <wox-modal>
    index.js             # Barrel export for all components
  demo/
    catalog.html         # Component catalog demo
    editor.html          # Full editor layout demo
    showcase.html        # Super showcase with all patterns
  index.html             # Landing page
```

---

## Next Steps

- Browse the [Component Index](./index.md) for all available components
- Read the [Theming Guide](./theming.md) to customize colors and spacing
- Open `demo/catalog.html` for an interactive component catalog
- Open `demo/showcase.html` for a comprehensive showcase of all patterns
