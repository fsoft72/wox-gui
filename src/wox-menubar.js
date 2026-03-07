// wox-menubar.js — Horizontal menubar container

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host {
        display: flex; align-items: center; flex-shrink: 0;
        height: var(--height, 32px); background: var(--wox-bg-toolbar, #1e1e22);
        border-bottom: 1px solid var(--wox-border, #333); padding: 0 12px; gap: 2px;
    }
    ::slotted(.logo) { display: flex; align-items: center; gap: 6px; margin-right: 18px; }
`;

/**
 * <wox-menubar> — Horizontal menubar. Slots <wox-menu> children.
 * @attr {string} height - Height in CSS units (default "32px")
 * @slot default - Menu children and logo
 */
class WoxMenubar extends WoxElement {
    static observedAttributes = ['height'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const height = this.getAttribute('height') || '32px';
        this.render(
            `${STYLES} :host { --height: ${height}; }`,
            `<slot></slot>`
        );

        // Left/right keyboard navigation between menus
        this.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            const menus = [...this.querySelectorAll('wox-menu')];
            const openIdx = menus.findIndex((m) => m.hasAttribute('open'));
            if (openIdx < 0) return;
            menus[openIdx].removeAttribute('open');
            const next = e.key === 'ArrowRight'
                ? (openIdx + 1) % menus.length
                : (openIdx - 1 + menus.length) % menus.length;
            menus[next].setAttribute('open', '');
        });
    };
}

export { WoxMenubar };
