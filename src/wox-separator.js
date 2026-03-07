// wox-separator.js — Horizontal/vertical divider component

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: block; flex-shrink: 0; }
    :host([direction="v"]) { display: inline-block; }
    .sep { background: var(--wox-border, #333); }
    .h { width: 100%; height: 1px; margin: var(--spacing, 0) 0; }
    .v { height: 100%; width: 1px; margin: 0 var(--spacing, 0); display: inline-block; vertical-align: middle; min-height: 16px; }
`;

/**
 * <wox-separator> — A thin line divider for horizontal or vertical layout.
 * @attr {string} direction - "h" (default) or "v" for horizontal/vertical
 * @attr {string} spacing   - CSS length for margin around the line (e.g. "8px")
 */
class WoxSeparator extends WoxElement {
    static observedAttributes = ['direction', 'spacing'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const dir = this.getAttribute('direction') || 'h';
        const spacing = this.getAttribute('spacing') || '0';
        this.render(
            `${STYLES} :host { --spacing: ${spacing}; }`,
            `<div class="sep ${dir}"></div>`
        );
    };
}

export { WoxSeparator };
