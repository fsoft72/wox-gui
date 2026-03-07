// wox-tabs.js — Tab container that manages header buttons from child wox-tab elements

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
    .tab-headers {
        background: var(--wox-bg-section-header, #22222a); display: flex;
        padding: 0 4px; border-bottom: 1px solid var(--wox-border-section, #2e2e2e); flex-shrink: 0;
    }
    .tab-btn {
        flex: 1; padding: 8px 4px; background: transparent; border: none;
        border-bottom: 2px solid transparent; color: var(--wox-text-secondary, #999);
        cursor: pointer; font-size: var(--wox-font-size-base, 12px); font-family: var(--wox-font, sans-serif);
        transition: all var(--wox-transition-fast, 0.12s); margin-bottom: -1px;
    }
    .tab-btn.active { color: var(--wox-text-hi, #fff); border-bottom-color: var(--wox-accent, #00e5ff); }
    .tab-btn:hover { color: var(--wox-text-primary, #eee); }
    .body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    /* Vertical left placement */
    :host([placement="left"]) { flex-direction: row; }
    :host([placement="left"]) .tab-headers {
        flex-direction: column; padding: 4px 0; border-bottom: none;
        border-right: 1px solid var(--wox-border-section, #2e2e2e);
    }
    :host([placement="left"]) .tab-btn {
        flex: none; border-bottom: none; margin-bottom: 0;
        border-right: 2px solid transparent; margin-right: -1px;
        writing-mode: vertical-rl; transform: rotate(180deg); padding: 8px 6px;
    }
    :host([placement="left"]) .tab-btn.active { border-right-color: var(--wox-accent, #00e5ff); }

    /* Vertical right placement */
    :host([placement="right"]) { flex-direction: row-reverse; }
    :host([placement="right"]) .tab-headers {
        flex-direction: column; padding: 4px 0; border-bottom: none;
        border-left: 1px solid var(--wox-border-section, #2e2e2e);
    }
    :host([placement="right"]) .tab-btn {
        flex: none; border-bottom: none; margin-bottom: 0;
        border-left: 2px solid transparent; margin-left: -1px;
        writing-mode: vertical-rl; padding: 8px 6px;
    }
    :host([placement="right"]) .tab-btn.active { border-left-color: var(--wox-accent, #00e5ff); }
`;

/**
 * <wox-tabs> — Tab container that builds header buttons from child <wox-tab> elements.
 * @attr {string} active - Name of the active tab
 * @attr {string} placement - Tab header position: "top" (default), "left", or "right"
 * @slot default - <wox-tab> children
 * @fires wox-tab-change - detail: { name }
 */
class WoxTabs extends WoxElement {
    static observedAttributes = ['active', 'placement'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._updateActive();
    }

    /** @private */
    _render = () => {
        this.render(STYLES, `
            <div class="tab-headers"></div>
            <div class="body"><slot></slot></div>
        `);

        const slot = this.$('slot');
        slot.addEventListener('slotchange', () => this._buildHeaders());
        this._buildHeaders();
    };

    /** @private */
    _buildHeaders = () => {
        const headers = this.$('.tab-headers');
        headers.innerHTML = '';

        const tabs = this._getTabs();
        const active = this.getAttribute('active') || (tabs[0]?.getAttribute('name') || '');

        tabs.forEach((tab) => {
            const name = tab.getAttribute('name') || '';
            const label = tab.getAttribute('label') || name;
            const btn = document.createElement('button');
            btn.className = 'tab-btn' + (name === active ? ' active' : '');
            btn.textContent = label;
            btn.addEventListener('click', () => {
                this.setAttribute('active', name);
                this.emit('wox-tab-change', { name });
            });
            headers.appendChild(btn);
        });

        this._updateActive();
    };

    /** @private */
    _updateActive = () => {
        const tabs = this._getTabs();
        const active = this.getAttribute('active') || (tabs[0]?.getAttribute('name') || '');

        tabs.forEach((tab) => {
            const name = tab.getAttribute('name') || '';
            if (name === active) tab.setAttribute('active', '');
            else tab.removeAttribute('active');
        });

        this.$$('.tab-btn').forEach((btn, i) => {
            const name = tabs[i]?.getAttribute('name') || '';
            btn.classList.toggle('active', name === active);
        });
    };

    /** @private */
    _getTabs = () => {
        return [...this.querySelectorAll(':scope > wox-tab')];
    };
}

export { WoxTabs };
