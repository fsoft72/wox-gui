// wox-icon.js — Material Icons wrapper component

import { WoxElement } from './wox-base.js';
import { FX_STYLES } from './wox-fx.js';

const STYLES = `
    :host { display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; }
    .material-icons { font-family: 'Material Icons'; font-weight: normal; font-style: normal; font-size: var(--size, 18px); display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; color: inherit; }
    ::slotted(svg) { width: var(--size, 18px); height: var(--size, 18px); }
    slot { display: inline-flex; align-items: center; justify-content: center; }
    .fx-wrap { display: inline-flex; align-items: center; justify-content: center; border-radius: var(--wox-radius-sm, 3px); padding: 4px; }
`;

/**
 * <wox-icon> — Wraps a Material Icons <span> or an SVG fallback via default slot.
 * @attr {string} name - Material Icons ligature name (e.g. "near_me")
 * @attr {string|number} size - Icon size in px (default 18)
 * @attr {string} color - Optional color override for icon and FX
 * @attr {boolean} glow - Enable neon glow effect (requires color)
 * @attr {boolean} pulse - Enable opacity pulse animation (composable with glow)
 */
class WoxIcon extends WoxElement {
    static observedAttributes = ['name', 'size', 'color', 'glow', 'pulse'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const name = this.getAttribute('name');
        const size = this.getAttribute('size') || '18';
        const color = this.getAttribute('color') || '';
        const glow = this.hasAttribute('glow');
        const pulse = this.hasAttribute('pulse');
        const hasFx = glow || pulse;

        const iconHtml = name
            ? `<span class="material-icons" style="--size:${size}px">${name}</span>`
            : `<slot></slot>`;

        const html = hasFx
            ? `<span class="fx-wrap${glow ? ' glow' : ''}${pulse ? ' pulse' : ''}" style="--wox-fx-color:${color};color:${color}">${iconHtml}</span>`
            : iconHtml;

        this.render(`${STYLES} ${FX_STYLES} :host { --size: ${size}px; }`, html);
    };
}

export { WoxIcon };
