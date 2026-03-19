// wox-color-swatch.js — Clickable color square with checkerboard for alpha

import { WoxElement } from './wox-base.js';
import { FX_STYLES } from './wox-fx.js';

const STYLES = `
    :host { display: inline-block; }
    .swatch {
        width: var(--size, 24px); height: var(--size, 24px);
        border-radius: var(--wox-radius-sm, 3px); cursor: pointer;
        border: 1px solid var(--wox-border);
        box-shadow: var(--wox-shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.3));
        transition: all var(--wox-transition-fast, 0.12s);
        position: relative; overflow: hidden;
    }
    .swatch:hover { transform: scale(1.1); border-color: var(--wox-accent, #00e5ff); }
    .swatch.selected { border-color: var(--wox-text-hi, #fff); border-width: 2px; box-shadow: var(--wox-shadow-accent); }
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
 * @attr {boolean} glow     - Enable neon glow effect using swatch color
 * @attr {boolean} pulse    - Enable opacity pulse animation
 * @fires wox-click - On click, detail: { color }
 */
class WoxColorSwatch extends WoxElement {
    static observedAttributes = ['color', 'size', 'selected', 'glow', 'pulse'];

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
        const glow = this.hasAttribute('glow');
        const pulse = this.hasAttribute('pulse');
        const fxClasses = [selected ? 'selected' : '', glow ? 'glow' : '', pulse ? 'pulse' : ''].filter(Boolean).join(' ');
        const fxStyle = (glow || pulse) ? ` style="--wox-fx-color:${color}"` : '';

        this.render(
            `${STYLES} ${FX_STYLES} :host { --size: ${size}px; }`,
            `<div class="swatch ${fxClasses}"${fxStyle}>
                <div class="checker"></div>
                <div class="color" style="background:${color}"></div>
            </div>`
        );

        this.$('.swatch').addEventListener('click', () => {
            this.emit('wox-click', { color });
        });
    };
}

export { WoxColorSwatch };
