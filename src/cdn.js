// cdn.js — Single-file CDN entry point.
// Registers all components and injects the theme stylesheet into the document.
// Usage: <script type="module" src="https://cdn.jsdelivr.net/npm/wox-gui/dist/wox-gui.cdn.js"></script>

export {
  WoxElement, FX_STYLES,
  WoxIcon, WoxSeparator, WoxBadge, WoxButton, WoxInput, WoxSelect,
  WoxSlider, WoxColorSwatch, WoxTooltip, WoxColorPicker,
  WoxMenuItem, WoxMenu, WoxLayerItem,
  WoxSection, WoxTab, WoxTabs, WoxToolbarGroup, WoxToolbar,
  WoxPanel, WoxMenubar, WoxStatusbar, WoxModal,
  WoxDatagrid, WoxToast, WoxContextMenu,
  WoxGradientEditor, gradientToCSS, cssToGradient, WoxGradientSelector,
  WoxDatePicker,
  WoxTheme, WoxThemeToggle,
} from './index.js';

import {
  WoxIcon, WoxSeparator, WoxBadge, WoxButton, WoxInput, WoxSelect,
  WoxSlider, WoxColorSwatch, WoxTooltip, WoxColorPicker,
  WoxMenuItem, WoxMenu, WoxLayerItem,
  WoxSection, WoxTab, WoxTabs, WoxToolbarGroup, WoxToolbar,
  WoxPanel, WoxMenubar, WoxStatusbar, WoxModal,
  WoxDatagrid, WoxToast, WoxContextMenu,
  WoxGradientEditor, WoxGradientSelector,
  WoxDatePicker,
  WoxThemeToggle,
} from './index.js';

// ── Register all custom elements ──
customElements.define('wox-icon', WoxIcon);
customElements.define('wox-separator', WoxSeparator);
customElements.define('wox-badge', WoxBadge);
customElements.define('wox-button', WoxButton);
customElements.define('wox-input', WoxInput);
customElements.define('wox-select', WoxSelect);
customElements.define('wox-slider', WoxSlider);
customElements.define('wox-color-swatch', WoxColorSwatch);
customElements.define('wox-tooltip', WoxTooltip);
customElements.define('wox-color-picker', WoxColorPicker);
customElements.define('wox-menu-item', WoxMenuItem);
customElements.define('wox-menu', WoxMenu);
customElements.define('wox-layer-item', WoxLayerItem);
customElements.define('wox-section', WoxSection);
customElements.define('wox-tab', WoxTab);
customElements.define('wox-tabs', WoxTabs);
customElements.define('wox-toolbar-group', WoxToolbarGroup);
customElements.define('wox-toolbar', WoxToolbar);
customElements.define('wox-panel', WoxPanel);
customElements.define('wox-menubar', WoxMenubar);
customElements.define('wox-statusbar', WoxStatusbar);
customElements.define('wox-modal', WoxModal);
customElements.define('wox-datagrid', WoxDatagrid);
customElements.define('wox-toast', WoxToast);
customElements.define('wox-context-menu', WoxContextMenu);
customElements.define('wox-gradient-editor', WoxGradientEditor);
customElements.define('wox-gradient-selector', WoxGradientSelector);
customElements.define('wox-date-picker', WoxDatePicker);
customElements.define('wox-theme-toggle', WoxThemeToggle);

// ── Inject theme CSS custom properties ──
/** Injects the WOX theme CSS custom properties into the document head. */
const _injectTheme = () => {
  if (document.getElementById('wox-theme')) return;

  const style = document.createElement('style');
  style.id = 'wox-theme';
  style.textContent = THEME_CSS;
  document.head.appendChild(style);
};

const THEME_CSS = `/* wox-theme.css — Global CSS custom properties for the WOX component library */
:root {
    --wox-bg-app: #121214;
    --wox-bg-panel: #17171a;
    --wox-bg-toolbar: #1e1e22;
    --wox-bg-input: #1a1a1d;
    --wox-bg-hover: #2a2a2e;
    --wox-bg-canvas: #505050;
    --wox-bg-section-header: #22222a;
    --wox-text-primary: #eee;
    --wox-text-secondary: #999;
    --wox-text-hi: #fff;
    --wox-accent: #00e5ff;
    --wox-border: #333;
    --wox-border-light: #444;
    --wox-border-section: #2e2e2e;
    --wox-danger: #f72585;
    --wox-success: #4cc9f0;
    --wox-unite: #4cc9f0;
    --wox-subtract: #f72585;
    --wox-intersect: #4361ee;
    --wox-exclude: #7209b7;
    --wox-space-xs: 2px;
    --wox-space-sm: 4px;
    --wox-space-md: 8px;
    --wox-space-lg: 12px;
    --wox-space-xl: 16px;
    --wox-space-2xl: 24px;
    --wox-radius-sm: 3px;
    --wox-radius-md: 6px;
    --wox-radius-lg: 8px;
    --wox-radius-xl: 10px;
    --wox-radius-2xl: 12px;
    --wox-radius-round: 50%;
    --wox-font: 'Inter', 'Segoe UI', sans-serif;
    --wox-font-mono: 'Courier New', monospace;
    --wox-font-size-xs: 9px;
    --wox-font-size-sm: 10px;
    --wox-font-size-md: 11px;
    --wox-font-size-base: 12px;
    --wox-font-size-lg: 13px;
    --wox-font-size-xl: 14px;
    --wox-font-size-2xl: 16px;
    --wox-z-base: 1;
    --wox-z-dropdown: 1000;
    --wox-z-overlay: 10000;
    --wox-z-modal: 20000;
    --wox-transition-fast: 0.12s ease;
    --wox-transition-normal: 0.2s ease;
    --wox-transition-smooth: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --wox-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
    --wox-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
    --wox-shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.6);
    --wox-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.8);
    --wox-shadow-input: inset 0 1px 3px rgba(0, 0, 0, 0.2);
    --wox-shadow-section: inset 0 -12px 24px -12px rgba(0, 0, 0, 0.5);
    --wox-shadow-accent: 0 0 10px rgba(0, 229, 255, 0.3);
}
:root[data-wox-theme="light"] {
    --wox-bg-app: #edeef1;
    --wox-bg-panel: #e8e9ee;
    --wox-bg-toolbar: #e2e3e8;
    --wox-bg-input: #ffffff;
    --wox-bg-hover: #d5d7de;
    --wox-bg-canvas: #d8dae0;
    --wox-bg-section-header: #dcdee4;
    --wox-text-primary: #1a1a1a;
    --wox-text-secondary: #6b6f7b;
    --wox-text-hi: #000000;
    --wox-accent: #0097a7;
    --wox-border: #b8bcc6;
    --wox-border-light: #a8acb8;
    --wox-border-section: #c5c8d0;
    --wox-danger: #d81b60;
    --wox-success: #00838f;
    --wox-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
    --wox-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
    --wox-shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.15);
    --wox-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.2);
    --wox-shadow-input: inset 0 1px 3px rgba(0, 0, 0, 0.06);
    --wox-shadow-section: inset 0 -12px 24px -12px rgba(0, 0, 0, 0.08);
    --wox-shadow-accent: 0 0 10px rgba(0, 151, 167, 0.25);
}`;

_injectTheme();

// ── Expose classes on window for non-import CDN usage ──
Object.assign(window, {
  WoxIcon, WoxSeparator, WoxBadge, WoxButton, WoxInput, WoxSelect,
  WoxSlider, WoxColorSwatch, WoxTooltip, WoxColorPicker,
  WoxMenuItem, WoxMenu, WoxLayerItem,
  WoxSection, WoxTab, WoxTabs, WoxToolbarGroup, WoxToolbar,
  WoxPanel, WoxMenubar, WoxStatusbar, WoxModal,
  WoxDatagrid, WoxToast, WoxContextMenu,
  WoxGradientEditor, WoxGradientSelector,
  WoxDatePicker, WoxThemeToggle,
});
