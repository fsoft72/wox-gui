// wox-menu-item.js — Menu row with label, shortcut, icon, and submenu arrow

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: block; }
    .item {
        color: var(--wox-text-primary, #eee); padding: 8px 12px; display: flex; align-items: center;
        gap: 8px; cursor: pointer; font-size: 11.5px; font-family: var(--wox-font, sans-serif);
        transition: all 0.2s; border-radius: var(--wox-radius-sm, 3px); user-select: none;
    }
    .item:hover { background-color: rgba(0, 229, 255, 0.1); color: var(--wox-accent, #00e5ff); }
    .item.disabled { opacity: 0.4; pointer-events: none; }
    .label { flex: 1; }
    .shortcut { font-size: var(--wox-font-size-sm, 10px); color: var(--wox-text-secondary, #999); margin-left: auto; }
    .item:hover .shortcut { color: rgba(0, 229, 255, 0.6); }
    .icon { font-size: 14px; width: 18px; text-align: center; }
    .arrow { font-size: 10px; color: var(--wox-text-secondary, #999); margin-left: 4px; }
    .separator { height: 1px; background: var(--wox-border, #333); margin: 4px 0; }
    .header {
        padding: 8px 12px; font-size: var(--wox-font-size-sm, 10px); color: var(--wox-text-secondary, #999);
        text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; cursor: default;
    }
    .material-icons { font-family: 'Material Icons'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; }
`;

/**
 * <wox-menu-item> — A single menu entry (item, separator, or header).
 * @attr {string}  label    - Display text
 * @attr {string}  shortcut - Keyboard shortcut hint (e.g. "Ctrl+N")
 * @attr {string}  icon     - Material Icons name
 * @attr {boolean} disabled - Disabled state
 * @attr {string}  type     - "item" (default), "separator", "header"
 * @attr {boolean} submenu  - Show submenu arrow indicator
 * @fires wox-select - On click, detail: { label }
 */
class WoxMenuItem extends WoxElement {
    static observedAttributes = ['label', 'shortcut', 'icon', 'disabled', 'type', 'submenu'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const type = this.getAttribute('type') || 'item';
        const label = this.getAttribute('label') || '';
        const shortcut = this.getAttribute('shortcut') || '';
        const icon = this.getAttribute('icon') || '';
        const disabled = this.hasAttribute('disabled');
        const hasSubmenu = this.hasAttribute('submenu');

        if (type === 'separator') {
            this.render(STYLES, `<div class="separator"></div>`);
            return;
        }

        if (type === 'header') {
            this.render(STYLES, `<div class="header">${label}</div>`);
            return;
        }

        this.render(STYLES, `
            <div class="item ${disabled ? 'disabled' : ''}">
                ${icon ? `<span class="icon material-icons">${icon}</span>` : ''}
                <span class="label">${label}</span>
                ${shortcut ? `<span class="shortcut">${shortcut}</span>` : ''}
                ${hasSubmenu ? `<span class="arrow">&#9654;</span>` : ''}
            </div>
        `);

        if (!disabled) {
            this.$('.item').addEventListener('click', () => {
                this.emit('wox-select', { label });
            });
        }
    };
}

customElements.define('wox-menu-item', WoxMenuItem);
export { WoxMenuItem };
