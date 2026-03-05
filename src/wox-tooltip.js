// wox-tooltip.js — Hover tooltip wrapper

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-block; position: relative; }
    .tip {
        position: absolute; z-index: var(--wox-z-overlay, 10000);
        background: #222; color: var(--wox-text-hi, #fff); border: 1px solid var(--wox-border-light, #444);
        border-radius: var(--wox-radius-sm, 3px); padding: 4px 8px; font-size: var(--wox-font-size-md, 11px);
        white-space: nowrap; pointer-events: none;
        opacity: 0; transition: opacity var(--wox-transition-fast, 0.12s);
        box-shadow: var(--wox-shadow-md, 0 4px 16px rgba(0, 0, 0, 0.4));
    }
    :host(:hover) .tip { opacity: 1; }
    .tip.top { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
    .tip.bottom { top: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
    .tip.left { right: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
    .tip.right { left: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
`;

/**
 * <wox-tooltip> — Shows a tooltip on hover around slotted content.
 * @attr {string} text     - Tooltip text
 * @attr {string} position - "top" (default), "bottom", "left", "right"
 * @attr {number} delay    - Show delay in ms (reserved for future use)
 */
class WoxTooltip extends WoxElement {
    static observedAttributes = ['text', 'position', 'delay'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const text = this.getAttribute('text') || '';
        const position = this.getAttribute('position') || 'top';

        this.render(STYLES, `
            <slot></slot>
            ${text ? `<div class="tip ${position}">${text}</div>` : ''}
        `);
    };
}

customElements.define('wox-tooltip', WoxTooltip);
export { WoxTooltip };
