// wox-button.js — Multi-variant button component (icon, text, tile, dash)

import { WoxElement } from './wox-base.js';
import { FX_STYLES } from './wox-fx.js';

const STYLES = `
    :host { display: inline-block; }
    button {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        background: transparent; border: 1px solid transparent; color: var(--wox-text-secondary, #999);
        cursor: pointer; font-family: var(--wox-font, sans-serif); font-size: var(--wox-font-size-base, 12px);
        transition: all var(--wox-transition-fast, 0.12s); border-radius: var(--wox-radius-sm, 3px);
        padding: 0; margin: 0; line-height: 1; user-select: none;
    }
    button:hover { background: var(--wox-bg-hover, #2a2a2e); color: var(--wox-text-hi, #fff); }
    button:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
    button.active { background: var(--wox-bg-hover, #2a2a2e); color: var(--wox-accent, #00e5ff); border-color: var(--wox-border-light, #444); }

    /* icon variant */
    button.v-icon { width: 34px; height: 32px; border-radius: var(--wox-radius-sm, 3px); }
    button.v-icon .material-icons { font-size: 18px; }

    /* text variant */
    button.v-text { padding: 6px 12px; border-radius: var(--wox-radius-md, 6px); font-size: var(--wox-font-size-base, 12px); }

    /* tile variant */
    button.v-tile {
        flex-direction: column; gap: 6px; background: var(--wox-bg-toolbar, #1e1e22);
        border: 1px solid var(--wox-border, #333); border-radius: var(--wox-radius-xl, 10px);
        padding: 12px 10px; min-width: 68px; font-size: var(--wox-font-size-sm, 10px);
        font-weight: 500; text-transform: uppercase;
        transition: all var(--wox-transition-smooth, 0.25s cubic-bezier(0.4, 0, 0.2, 1));
        position: relative; overflow: hidden;
    }
    button.v-tile:hover { background: var(--wox-bg-hover, #2a2a2e); border-color: #555; color: var(--wox-text-primary, #eee); transform: translateY(-1px); }
    button.v-tile:hover svg, button.v-tile:hover .material-icons { transform: scale(1.05); opacity: 1; }
    button.v-tile svg, button.v-tile .material-icons { display: block; width: 32px; height: 32px; transition: transform 0.2s; opacity: 0.8; font-size: 28px; }
    button.v-tile.delete:hover { border-color: var(--wox-danger, #f72585); color: var(--wox-danger, #f72585); background: rgba(247, 37, 133, 0.05); }

    /* tile with custom color accent */
    button.v-tile[data-color] { --wox-fx-color: var(--wox-text-secondary, #999); }
    button.v-tile[data-color]:hover {
        background: color-mix(in srgb, var(--wox-fx-color), transparent 92%);
        border-color: var(--wox-fx-color); color: var(--wox-fx-color);
        box-shadow: 0 0 15px color-mix(in srgb, var(--wox-fx-color), transparent 80%);
    }
    button.v-tile[data-color]:hover svg { filter: drop-shadow(0 0 4px var(--wox-fx-color)); }

    /* dash variant */
    button.v-dash {
        width: 42px; height: 26px; background: #1c1c21;
        border: 1px solid var(--wox-border, #333); border-radius: var(--wox-radius-lg, 8px);
        transition: all 0.2s;
    }
    button.v-dash:hover { background: var(--wox-bg-hover, #2a2a2e); border-color: #555; transform: translateY(-1px); }
    button.v-dash.active { border-color: var(--wox-accent, #00e5ff); box-shadow: var(--wox-shadow-accent, 0 0 10px rgba(0, 229, 255, 0.3)); }
    .dash-line { width: 16px; height: 3px; background: #666; border-radius: 1px; }
    button.v-dash.active .dash-line { background: var(--wox-accent, #00e5ff); }
    .dash-line.dotted { background: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 4px 100%; color: #666; }
    button.v-dash.active .dash-line.dotted { color: var(--wox-accent, #00e5ff); }
    .dash-line.dashed { background: linear-gradient(to right, currentColor 6px, transparent 6px); background-size: 10px 100%; color: #666; }
    button.v-dash.active .dash-line.dashed { color: var(--wox-accent, #00e5ff); }
    .dash-line.longdash { background: linear-gradient(to right, currentColor 12px, transparent 4px); background-size: 16px 100%; color: #666; }
    button.v-dash.active .dash-line.longdash { color: var(--wox-accent, #00e5ff); }
    .dash-line.dotdash { background: linear-gradient(to right, currentColor 8px, transparent 4px, currentColor 2px, transparent 4px); background-size: 18px 100%; color: #666; }
    button.v-dash.active .dash-line.dotdash { color: var(--wox-accent, #00e5ff); }
    .dash-line.zigzag { background: repeating-linear-gradient(45deg, currentColor, currentColor 2px, transparent 2px, transparent 4px); color: #666; }
    button.v-dash.active .dash-line.zigzag { color: var(--wox-accent, #00e5ff); }

    .material-icons { font-family: 'Material Icons'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; }
`;

/**
 * <wox-button> — Multi-variant button.
 * @attr {string}  variant  - "icon" (default), "text", "tile", or "dash"
 * @attr {string}  icon     - Material Icons name
 * @attr {string}  label    - Button label text
 * @attr {boolean} active   - Active/selected state (presence attr)
 * @attr {boolean} disabled - Disabled state
 * @attr {string}  color    - Optional accent override (for tile)
 * @attr {string}  size     - Size override
 * @attr {string}  dash     - Dash pattern: "solid", "dotted", "dashed", "longdash", "dotdash", "zigzag"
 * @attr {boolean} glow     - Enable neon glow effect (requires color)
 * @attr {boolean} pulse    - Enable opacity pulse animation (composable with glow)
 * @fires wox-click - Emitted on click with no detail
 */
class WoxButton extends WoxElement {
    static observedAttributes = ['variant', 'icon', 'label', 'active', 'disabled', 'color', 'size', 'dash', 'glow', 'pulse'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const variant = this.getAttribute('variant') || 'icon';
        const icon = this.getAttribute('icon') || '';
        const label = this.getAttribute('label') || '';
        const active = this.hasAttribute('active');
        const disabled = this.hasAttribute('disabled');
        const dash = this.getAttribute('dash') || 'solid';
        const color = this.getAttribute('color') || '';
        const glow = this.hasAttribute('glow');
        const pulse = this.hasAttribute('pulse');

        const classes = [`v-${variant}`, active ? 'active' : '', glow ? 'glow' : '', pulse ? 'pulse' : ''].filter(Boolean).join(' ');
        let content = '';

        if (variant === 'icon') {
            content = icon ? `<span class="material-icons">${icon}</span>` : `<slot></slot>`;
        } else if (variant === 'text') {
            content = (icon ? `<span class="material-icons" style="font-size:14px">${icon}</span>` : '') + (label || `<slot></slot>`);
        } else if (variant === 'tile') {
            content = (icon ? `<span class="material-icons">${icon}</span>` : `<slot name="icon"></slot>`) + `<span>${label}</span>`;
        } else if (variant === 'dash') {
            const dashClass = dash === 'solid' ? '' : ` ${dash}`;
            content = `<div class="dash-line${dashClass}"></div>`;
        }

        const colorAttr = color ? ` data-color style="--wox-fx-color:${color}"` : '';

        this.render(STYLES + FX_STYLES,
            `<button class="${classes}"${colorAttr} ${disabled ? 'disabled' : ''}>${content}</button>`
        );

        this.$('button').addEventListener('click', (e) => {
            if (!disabled) this.emit('wox-click', { originalEvent: e });
        });
    };
}

customElements.define('wox-button', WoxButton);
export { WoxButton };
