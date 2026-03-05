// wox-icon.js — Material Icons wrapper component

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; }
    .material-icons { font-family: 'Material Icons'; font-weight: normal; font-style: normal; font-size: var(--size, 18px); display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; color: inherit; }
    ::slotted(svg) { width: var(--size, 18px); height: var(--size, 18px); }
    slot { display: inline-flex; align-items: center; justify-content: center; }
`;

/**
 * <wox-icon> — Wraps a Material Icons <span> or an SVG fallback via default slot.
 * @attr {string} name - Material Icons ligature name (e.g. "near_me")
 * @attr {string|number} size - Icon size in px (default 18)
 */
class WoxIcon extends WoxElement {
    static observedAttributes = ['name', 'size'];

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
        const html = name
            ? `<span class="material-icons" style="--size:${size}px">${name}</span>`
            : `<slot></slot>`;
        this.render(`${STYLES} :host { --size: ${size}px; }`, html);
    };
}

customElements.define('wox-icon', WoxIcon);
export { WoxIcon };
