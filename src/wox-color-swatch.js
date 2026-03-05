// wox-color-swatch.js — Clickable color square with checkerboard for alpha

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-block; }
    .swatch {
        width: var(--size, 24px); height: var(--size, 24px);
        border-radius: var(--wox-radius-sm, 3px); cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.5);
        box-shadow: var(--wox-shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.3));
        transition: all var(--wox-transition-fast, 0.12s);
        position: relative; overflow: hidden;
    }
    .swatch:hover { transform: scale(1.1); border-color: var(--wox-accent, #00e5ff); }
    .swatch.selected { border-color: var(--wox-text-hi, #fff); border-width: 2px; box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
    .checker {
        position: absolute; inset: 0;
        background: repeating-conic-gradient(#888 0% 25%, #fff 0% 50%) 0 0 / 8px 8px;
    }
    .color { position: absolute; inset: 0; }
`;

/**
 * <wox-color-swatch> — Clickable color square with alpha checkerboard.
 * @attr {string}  color    - CSS color value (default "transparent")
 * @attr {string}  size     - Size in px (default "24")
 * @attr {boolean} selected - Selected/active state (presence attr)
 * @fires wox-click - On click, detail: { color }
 */
class WoxColorSwatch extends WoxElement {
    static observedAttributes = ['color', 'size', 'selected'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const color = this.getAttribute('color') || 'transparent';
        const size = this.getAttribute('size') || '24';
        const selected = this.hasAttribute('selected');

        this.render(
            `${STYLES} :host { --size: ${size}px; }`,
            `<div class="swatch ${selected ? 'selected' : ''}">
                <div class="checker"></div>
                <div class="color" style="background:${color}"></div>
            </div>`
        );

        this.$('.swatch').addEventListener('click', () => {
            this.emit('wox-click', { color });
        });
    };
}

customElements.define('wox-color-swatch', WoxColorSwatch);
export { WoxColorSwatch };
