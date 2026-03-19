// wox-tooltip.js — Hover tooltip wrapper

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-block; position: relative; }
    .tip {
        position: fixed; z-index: var(--wox-z-overlay, 10000);
        background: var(--wox-bg-toolbar, #222); color: var(--wox-text-hi, #fff); border: 1px solid var(--wox-border-light, #444);
        border-radius: var(--wox-radius-sm, 3px); padding: 4px 8px; font-size: var(--wox-font-size-md, 11px);
        white-space: nowrap; pointer-events: none;
        opacity: 0; transition: opacity var(--wox-transition-fast, 0.12s);
        box-shadow: var(--wox-shadow-md, 0 4px 16px rgba(0, 0, 0, 0.4));
    }
    :host(:hover) .tip { opacity: 1; }
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

        this.render(STYLES, `
            <slot></slot>
            ${text ? `<div class="tip">${text}</div>` : ''}
        `);

        if (!text) return;

        this.addEventListener('mouseenter', this._position);
    };

    /** @private Positions the tooltip relative to the host, flipping if it would overflow the viewport */
    _position = () => {
        const tip = this.shadowRoot.querySelector('.tip');
        if (!tip) return;

        const GAP = 6;
        const preferred = this.getAttribute('position') || 'top';
        const hostRect = this.getBoundingClientRect();
        const tipRect = tip.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const fits = {
            top: hostRect.top - GAP - tipRect.height >= 0,
            bottom: hostRect.bottom + GAP + tipRect.height <= vh,
            left: hostRect.left - GAP - tipRect.width >= 0,
            right: hostRect.right + GAP + tipRect.width <= vw,
        };

        // Pick placement: preferred if it fits, otherwise flip, otherwise first that fits
        const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
        const order = [preferred, opposite[preferred], ...['top', 'bottom', 'left', 'right'].filter(d => d !== preferred && d !== opposite[preferred])];
        const placement = order.find(d => fits[d]) || preferred;

        let top, left;

        if (placement === 'top') {
            top = hostRect.top - GAP - tipRect.height;
            left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;
        } else if (placement === 'bottom') {
            top = hostRect.bottom + GAP;
            left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;
        } else if (placement === 'left') {
            top = hostRect.top + hostRect.height / 2 - tipRect.height / 2;
            left = hostRect.left - GAP - tipRect.width;
        } else {
            top = hostRect.top + hostRect.height / 2 - tipRect.height / 2;
            left = hostRect.right + GAP;
        }

        // Clamp to viewport edges
        left = Math.max(4, Math.min(left, vw - tipRect.width - 4));
        top = Math.max(4, Math.min(top, vh - tipRect.height - 4));

        tip.style.top = `${top}px`;
        tip.style.left = `${left}px`;
    };
}

export { WoxTooltip };
