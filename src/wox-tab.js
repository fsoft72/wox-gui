// wox-tab.js — Single tab panel (visibility managed by parent wox-tabs)

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: none; flex: 1; overflow-y: auto; overflow-x: hidden; flex-direction: column; }
    :host([active]) { display: flex; }
`;

/**
 * <wox-tab> — A single tab panel. Visibility is controlled by the parent <wox-tabs>.
 * @attr {string} name  - Unique tab identifier
 * @attr {string} label - Display label for the tab header button
 * @attr {string} icon  - Material Icons name for the header
 */
class WoxTab extends WoxElement {
    static observedAttributes = ['name', 'label', 'icon', 'active'];

    connectedCallback() {
        this.render(STYLES, `<slot></slot>`);
    }
}

customElements.define('wox-tab', WoxTab);
export { WoxTab };
