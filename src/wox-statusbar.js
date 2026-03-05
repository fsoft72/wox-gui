// wox-statusbar.js — Bottom status bar with left/center/right slots

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host {
        display: flex; align-items: center; flex-shrink: 0;
        height: var(--height, 24px); background: var(--wox-accent, #00e5ff);
        border-top: 1px solid var(--wox-border, #333); padding: 0 12px;
    }
    .left, .center, .right { display: flex; align-items: center; gap: 8px; }
    .left { flex: 1; justify-content: flex-start; }
    .center { flex: 1; justify-content: center; }
    .right { flex: 1; justify-content: flex-end; }
    ::slotted(*) { font-size: var(--wox-font-size-md, 11px); color: rgba(255, 255, 255, 0.9); }
`;

/**
 * <wox-statusbar> — Bottom status bar with three-column layout.
 * @attr {string} height - Height in CSS units (default "24px")
 * @slot left   - Left-aligned content
 * @slot center - Center-aligned content
 * @slot right  - Right-aligned content
 */
class WoxStatusbar extends WoxElement {
    static observedAttributes = ['height'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const height = this.getAttribute('height') || '24px';
        this.render(
            `${STYLES} :host { --height: ${height}; }`,
            `<div class="left"><slot name="left"></slot></div>
             <div class="center"><slot name="center"></slot></div>
             <div class="right"><slot name="right"></slot></div>`
        );
    };
}

customElements.define('wox-statusbar', WoxStatusbar);
export { WoxStatusbar };
