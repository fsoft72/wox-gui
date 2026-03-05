// wox-toolbar.js — Vertical toolbar container

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host {
        display: flex; flex-direction: column; align-items: center;
        background: var(--wox-bg-toolbar, #1e1e22);
        border-right: 1px solid var(--wox-border, #333);
        padding: 6px 0; flex-shrink: 0;
        width: var(--width, 44px);
    }
    :host([position="right"]) { border-right: none; border-left: 1px solid var(--wox-border, #333); }
`;

/**
 * <wox-toolbar> — Vertical toolbar container.
 * @attr {string} width    - Width in CSS units (default "44px")
 * @attr {string} position - "left" (default) or "right"
 * @slot default - Toolbar group children
 */
class WoxToolbar extends WoxElement {
    static observedAttributes = ['width', 'position'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const width = this.getAttribute('width') || '44px';
        this.render(
            `${STYLES} :host { --width: ${width}; }`,
            `<slot></slot>`
        );
    };
}

customElements.define('wox-toolbar', WoxToolbar);
export { WoxToolbar };
