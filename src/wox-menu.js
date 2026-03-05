// wox-menu.js — Dropdown menu container

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-block; position: relative; }
    .trigger { color: var(--wox-text-primary, #eee); padding: 3px 8px; border-radius: var(--wox-radius-sm, 3px); cursor: pointer; font-size: var(--wox-font-size-base, 12px); display: block; user-select: none; }
    .trigger:hover { background: var(--wox-bg-hover, #2a2a2e); color: var(--wox-text-hi, #fff); }
    .dropdown {
        display: none; position: absolute; top: 100%; left: 0; z-index: var(--wox-z-dropdown, 1000);
        background: var(--wox-bg-panel, #17171a); min-width: 160px;
        box-shadow: var(--wox-shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.6));
        border: 1px solid var(--wox-border, #333); border-radius: var(--wox-radius-lg, 8px);
        overflow: hidden; padding: 4px;
    }
    .dropdown.open { display: block; }
    /* Invisible bridge to keep menu open while moving mouse */
    .dropdown::before { content: ''; position: absolute; top: -10px; left: 0; right: 0; height: 10px; }
`;

/**
 * <wox-menu> — Dropdown menu that wraps <wox-menu-item> children.
 * @attr {string}  label   - Trigger label text
 * @attr {boolean} open    - Show/hide the dropdown
 * @attr {string}  trigger - "click" (default), "hover", or "context"
 * @fires wox-open  - When menu opens
 * @fires wox-close - When menu closes
 */
class WoxMenu extends WoxElement {
    static observedAttributes = ['label', 'open', 'trigger'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name) {
        if (!this.isConnected) return;
        if (name === 'open') {
            const dd = this.$('.dropdown');
            if (!dd) return;
            if (this.hasAttribute('open')) {
                dd.classList.add('open');
                this.emit('wox-open', {});
            } else {
                dd.classList.remove('open');
                this.emit('wox-close', {});
            }
            return;
        }
        this._render();
    }

    /** @private */
    _render = () => {
        const label = this.getAttribute('label') || '';
        const isOpen = this.hasAttribute('open');
        const triggerMode = this.getAttribute('trigger') || 'click';

        this.render(STYLES, `
            <span class="trigger">${label}</span>
            <div class="dropdown ${isOpen ? 'open' : ''}">
                <slot></slot>
            </div>
        `);

        const trigger = this.$('.trigger');
        const dropdown = this.$('.dropdown');

        if (triggerMode === 'click') {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggle();
            });
        } else if (triggerMode === 'hover') {
            this.addEventListener('mouseenter', () => this._open());
            this.addEventListener('mouseleave', () => this._close());
        }

        // Close on outside click
        this._outsideClick = (e) => {
            if (!this.contains(e.target) && this.hasAttribute('open')) {
                this._close();
            }
        };
        document.addEventListener('mousedown', this._outsideClick);

        // Close on item select
        this.addEventListener('wox-select', () => this._close());
    };

    disconnectedCallback() {
        if (this._outsideClick) document.removeEventListener('mousedown', this._outsideClick);
    }

    /** @private */
    _toggle = () => {
        if (this.hasAttribute('open')) this._close();
        else this._open();
    };

    /** @private */
    _open = () => {
        this.setAttribute('open', '');
        // Viewport flip
        requestAnimationFrame(() => {
            const dd = this.$('.dropdown');
            if (!dd) return;
            const rect = dd.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                dd.style.left = 'auto';
                dd.style.right = '0';
            }
            if (rect.bottom > window.innerHeight) {
                dd.style.top = 'auto';
                dd.style.bottom = '100%';
            }
        });
    };

    /** @private */
    _close = () => {
        this.removeAttribute('open');
    };
}

customElements.define('wox-menu', WoxMenu);
export { WoxMenu };
