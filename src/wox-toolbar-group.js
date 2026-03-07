// wox-toolbar-group.js — Grouped section in a toolbar with optional label

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: flex; flex-direction: column; align-items: center; padding: 4px 0; border-bottom: 1px solid var(--wox-border, #333); width: 100%; }
    :host(:last-of-type) { border-bottom: none; }
    .label { font-size: var(--wox-font-size-xs, 9px); color: var(--wox-text-secondary, #999); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
`;

/**
 * <wox-toolbar-group> — A group of tool buttons inside a toolbar.
 * @attr {string} label - Optional group label
 * @slot default - Button children
 */
class WoxToolbarGroup extends WoxElement {
    static observedAttributes = ['label'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const label = this.getAttribute('label') || '';
        this.render(STYLES, `
            <slot></slot>
            ${label ? `<span class="label">${label}</span>` : ''}
        `);
    };
}

export { WoxToolbarGroup };
