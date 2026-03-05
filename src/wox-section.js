// wox-section.js — Collapsible panel section

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: block; border-bottom: 1px solid var(--wox-border-section, #2e2e2e); }
    .header {
        background: var(--wox-bg-section-header, #22222a); padding: 8px 16px;
        display: flex; align-items: center; gap: 10px;
        border-bottom: 1px solid var(--wox-border-section, #2e2e2e);
        font-size: var(--wox-font-size-md, 11px); color: var(--wox-text-primary, #eee);
        font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;
        cursor: pointer; user-select: none;
    }
    .diamond {
        display: flex; align-items: center; color: var(--wox-accent, #00e5ff); font-size: 13px;
    }
    .diamond::before {
        content: ''; display: block; width: 8px; height: 8px;
        background: var(--wox-accent, #00e5ff); transform: rotate(45deg); flex-shrink: 0;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    }
    .title { font-size: var(--wox-font-size-md, 11px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-left: 8px; }
    .chevron { margin-left: auto; font-size: 16px; transition: transform 0.2s; color: var(--wox-text-secondary, #999); }
    .chevron.collapsed { transform: rotate(-90deg); }
    .actions { margin-left: auto; display: flex; gap: 4px; align-items: center; }
    .body {
        padding: var(--wox-space-xl, 16px); overflow: hidden;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 100%);
        box-shadow: var(--wox-shadow-section);
    }
    .body.collapsed { display: none; }
    .material-icons { font-family: 'Material Icons'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; }
`;

/**
 * <wox-section> — Collapsible panel section with header and body.
 * @attr {string}  title     - Section title
 * @attr {boolean} collapsed - Collapsed state
 * @attr {string}  icon      - Material Icons name for the header (unused if diamond preferred)
 * @slot default        - Section body content
 * @slot header-actions - Actions on the right side of the header
 * @fires wox-toggle - detail: { collapsed }
 */
class WoxSection extends WoxElement {
    static observedAttributes = ['title', 'collapsed', 'icon'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const title = this.getAttribute('title') || '';
        const collapsed = this.hasAttribute('collapsed');

        this.render(STYLES, `
            <div class="header">
                <div class="diamond"></div>
                <span class="title">${title}</span>
                <div class="actions"><slot name="header-actions"></slot></div>
                <span class="chevron material-icons ${collapsed ? 'collapsed' : ''}">expand_more</span>
            </div>
            <div class="body ${collapsed ? 'collapsed' : ''}">
                <slot></slot>
            </div>
        `);

        this.$('.header').addEventListener('click', () => {
            const nowCollapsed = !this.hasAttribute('collapsed');
            if (nowCollapsed) this.setAttribute('collapsed', '');
            else this.removeAttribute('collapsed');
            this.emit('wox-toggle', { collapsed: nowCollapsed });
        });
    };
}

customElements.define('wox-section', WoxSection);
export { WoxSection };
