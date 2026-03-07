// wox-badge.js — Small indicator badge (dot, diamond, text)

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-flex; align-items: center; justify-content: center; }
    .badge { display: inline-flex; align-items: center; justify-content: center; }
    .dot { width: 8px; height: 8px; border-radius: var(--wox-radius-round, 50%); background: var(--color, var(--wox-accent, #00e5ff)); }
    .diamond { width: 8px; height: 8px; background: var(--color, var(--wox-accent, #00e5ff)); transform: rotate(45deg); box-shadow: 0 0 10px color-mix(in srgb, var(--color, var(--wox-accent, #00e5ff)), transparent 50%); }
    .text { background: color-mix(in srgb, var(--color, var(--wox-accent, #00e5ff)), transparent 85%); color: var(--color, var(--wox-accent, #00e5ff)); padding: 3px 8px; border-radius: var(--wox-radius-sm, 3px); font-weight: 600; font-size: var(--wox-font-size-sm, 10px); text-transform: uppercase; letter-spacing: 0.5px; }
`;

/**
 * <wox-badge> — Indicator dot, diamond, or text badge.
 * @attr {string} variant - "dot" (default), "diamond", or "text"
 * @attr {string} text    - Text content (only for variant="text")
 * @attr {string} color   - CSS color (defaults to --wox-accent)
 */
class WoxBadge extends WoxElement {
    static observedAttributes = ['variant', 'text', 'color'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const variant = this.getAttribute('variant') || 'dot';
        const text = this.getAttribute('text') || '';
        const color = this.getAttribute('color') || '';
        const colorStyle = color ? `--color: ${color};` : '';

        let inner = '';
        if (variant === 'dot') inner = `<span class="badge dot" style="${colorStyle}"></span>`;
        else if (variant === 'diamond') inner = `<span class="badge diamond" style="${colorStyle}"></span>`;
        else inner = `<span class="badge text" style="${colorStyle}">${text}</span>`;

        this.render(STYLES, inner);
    };
}

export { WoxBadge };
