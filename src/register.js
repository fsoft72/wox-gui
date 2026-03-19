// register.js — Imports all WOX components and registers them as custom elements.
// Usage: import 'wox-gui/register';

import {
  WoxIcon,
  WoxSeparator,
  WoxBadge,
  WoxButton,
  WoxInput,
  WoxSelect,
  WoxSlider,
  WoxColorSwatch,
  WoxTooltip,
  WoxColorPicker,
  WoxMenuItem,
  WoxMenu,
  WoxLayerItem,
  WoxSection,
  WoxTab,
  WoxTabs,
  WoxToolbarGroup,
  WoxToolbar,
  WoxPanel,
  WoxMenubar,
  WoxStatusbar,
  WoxModal,
  WoxDatagrid,
  WoxToast,
  WoxContextMenu,
  WoxGradientEditor,
  WoxGradientSelector,
  WoxDatePicker,
  WoxThemeToggle,
} from './index.js';

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
