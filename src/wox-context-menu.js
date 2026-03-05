// wox-context-menu.js — Singleton context menu with static API (light DOM)

import { WoxElement } from './wox-base.js';

/* ── Constants ─────────────────────────────────────────────────── */

const STYLE_ID = 'wox-ctx-menu-styles';
const MENU_ID = 'wox-ctx-menu';
const VIEWPORT_PADDING = 4;
const Z_INDEX = 30000;

const CSS = `
.wox-ctx-menu {
    position: fixed;
    background: var(--wox-bg-panel, #17171a);
    border: 1px solid var(--wox-border, #333);
    border-radius: var(--wox-radius-md, 6px);
    box-shadow: var(--wox-shadow-lg);
    padding: var(--wox-space-sm, 4px);
    min-width: 180px;
    z-index: ${Z_INDEX};
    font-family: var(--wox-font, 'Inter', sans-serif);
    font-size: var(--wox-font-size-base, 12px);
    color: var(--wox-text-primary, #eee);
    display: none;
}
.wox-ctx-menu-item {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 12px; border-radius: var(--wox-radius-sm, 3px);
    cursor: pointer; transition: background var(--wox-transition-fast, 0.12s ease);
    user-select: none;
}
.wox-ctx-menu-item:hover { background: var(--wox-bg-hover, #2a2a2e); }
.wox-ctx-menu-item--disabled { opacity: 0.4; pointer-events: none; }
.wox-ctx-menu-icon { width: 18px; text-align: center; flex-shrink: 0; font-size: 16px; color: var(--wox-text-secondary, #999); }
.wox-ctx-menu-label { flex: 1; }
.wox-ctx-menu-shortcut { font-size: var(--wox-font-size-sm, 10px); color: var(--wox-text-secondary, #999); margin-left: 16px; }
.wox-ctx-menu-divider { height: 1px; background: var(--wox-border, #333); margin: 4px 8px; }
`;

/* ── Style injection (once, into <head>) ──────────────────────── */

/** @private Injects the context-menu stylesheet into <head> if not already present. */
const _injectStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
};

/* ── Component ─────────────────────────────────────────────────── */

/**
 * <wox-context-menu> — Singleton context menu rendered in light DOM.
 *
 * This element is a no-render shell. All work is performed via static methods:
 *   WoxContextMenu.show(event, items)  — show at mouse position
 *   WoxContextMenu.hide()              — dismiss the menu
 *
 * Items array entries:
 *   { label, icon, action, disabled, divider, shortcut }
 *   - divider: true  renders a horizontal separator
 *   - icon           optional Material Icons ligature
 *   - shortcut       optional right-aligned hint text
 *   - disabled: true grayed out, click ignored
 *
 * @example
 *   WoxContextMenu.show(e, [
 *     { label: 'Cut',   icon: 'content_cut',   shortcut: 'Ctrl+X', action: () => cut() },
 *     { divider: true },
 *     { label: 'Paste', icon: 'content_paste',  shortcut: 'Ctrl+V', action: () => paste() },
 *   ]);
 */
class WoxContextMenu extends WoxElement {

    /* ── Singleton state ── */

    /** @type {HTMLDivElement|null} */
    static _el = null;

    /** @type {boolean} */
    static _listenersReady = false;

    /**
     * Show the context menu at the pointer position.
     * @param {MouseEvent} event - The triggering mouse event (used for clientX / clientY).
     * @param {Array<{label?: string, icon?: string, action?: Function, disabled?: boolean, divider?: boolean, shortcut?: string}>} items
     */
    static show = (event, items) => {
        if (!event || !items) return;

        event.preventDefault();
        event.stopPropagation();

        _injectStyles();

        // Create or reuse the singleton element
        let menu = WoxContextMenu._el;
        if (!menu) {
            menu = document.createElement('div');
            menu.id = MENU_ID;
            menu.className = 'wox-ctx-menu';
            document.body.appendChild(menu);
            WoxContextMenu._el = menu;
        }

        // Build items
        menu.innerHTML = '';
        items.forEach((item) => {
            if (item.divider) {
                const div = document.createElement('div');
                div.className = 'wox-ctx-menu-divider';
                menu.appendChild(div);
                return;
            }

            const row = document.createElement('div');
            row.className = 'wox-ctx-menu-item';
            if (item.disabled) row.classList.add('wox-ctx-menu-item--disabled');

            // Icon column (always present for alignment)
            const iconEl = document.createElement('i');
            iconEl.className = 'material-icons wox-ctx-menu-icon';
            iconEl.textContent = item.icon || '';
            row.appendChild(iconEl);

            // Label
            const labelEl = document.createElement('span');
            labelEl.className = 'wox-ctx-menu-label';
            labelEl.textContent = item.label || '';
            row.appendChild(labelEl);

            // Shortcut hint (optional)
            if (item.shortcut) {
                const shortcutEl = document.createElement('span');
                shortcutEl.className = 'wox-ctx-menu-shortcut';
                shortcutEl.textContent = item.shortcut;
                row.appendChild(shortcutEl);
            }

            // Click handler (skip for disabled)
            if (!item.disabled) {
                row.addEventListener('click', () => {
                    WoxContextMenu.hide();
                    if (item.action) item.action();
                });
            }

            menu.appendChild(row);
        });

        // Position at click coords
        menu.style.display = 'block';
        menu.style.left = `${event.clientX}px`;
        menu.style.top = `${event.clientY}px`;

        // Defer viewport clamping so the element has layout
        requestAnimationFrame(() => {
            const rect = menu.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            if (rect.right > vw) menu.style.left = `${vw - rect.width - VIEWPORT_PADDING}px`;
            if (rect.bottom > vh) menu.style.top = `${vh - rect.height - VIEWPORT_PADDING}px`;
        });

        // Register global listeners once
        if (!WoxContextMenu._listenersReady) {
            document.addEventListener('click', WoxContextMenu._onClickOutside, true);
            document.addEventListener('contextmenu', WoxContextMenu._onClickOutside, true);
            document.addEventListener('keydown', WoxContextMenu._onKeyDown, true);
            WoxContextMenu._listenersReady = true;
        }
    };

    /**
     * Hide the context menu if it is currently visible.
     */
    static hide = () => {
        if (!WoxContextMenu._el) return;
        WoxContextMenu._el.style.display = 'none';
    };

    /* ── Private global handlers ── */

    /**
     * Closes the menu when clicking outside of it.
     * @param {MouseEvent} e
     * @private
     */
    static _onClickOutside = (e) => {
        if (!WoxContextMenu._el) return;
        if (WoxContextMenu._el.style.display === 'none') return;
        if (WoxContextMenu._el.contains(e.target)) return;
        WoxContextMenu.hide();
    };

    /**
     * Closes the menu on Escape key press.
     * @param {KeyboardEvent} e
     * @private
     */
    static _onKeyDown = (e) => {
        if (e.key === 'Escape') WoxContextMenu.hide();
    };
}

customElements.define('wox-context-menu', WoxContextMenu);
export { WoxContextMenu };
