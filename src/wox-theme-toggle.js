// wox-theme-toggle.js — Sun/moon icon button for switching themes

import { WoxElement } from './wox-base.js';
import { WoxTheme } from './wox-theme.js';

const STYLES = `
    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 32px;
        background: transparent;
        border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-sm, 3px);
        color: var(--wox-text-secondary, #999);
        cursor: pointer;
        transition: all var(--wox-transition-fast, 0.12s);
        padding: 0;
    }
    button:hover {
        background: var(--wox-bg-hover, #2a2a2e);
        color: var(--wox-text-hi, #fff);
        border-color: var(--wox-border-light, #444);
    }
    .icon {
        font-family: 'Material Icons';
        font-size: 18px;
        font-weight: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
    }
`;

/**
 * <wox-theme-toggle> — Sun/moon icon button for switching between dark and light themes.
 *
 * Attributes:
 *   - `auto` (boolean) — respect OS `prefers-color-scheme` when no saved preference exists
 *
 * Events:
 *   - Listens for `wox-theme-change` on `document.documentElement` to stay in sync
 *
 * @extends WoxElement
 */
export class WoxThemeToggle extends WoxElement {

    /** @type {Function|null} Bound event handler for cleanup */
    _onThemeChange = null;

    connectedCallback() {
        this._render();

        if (this.hasAttribute('auto')) {
            WoxTheme.auto();
        }

        this._onThemeChange = () => this._updateIcon();
        document.documentElement.addEventListener('wox-theme-change', this._onThemeChange);

        this._updateIcon();
    }

    disconnectedCallback() {
        if (this._onThemeChange) {
            document.documentElement.removeEventListener('wox-theme-change', this._onThemeChange);
            this._onThemeChange = null;
        }
    }

    /** Build the shadow DOM. */
    _render() {
        this.render(STYLES, `<button type="button" title="Toggle theme"><span class="icon">light_mode</span></button>`);
        this.$('button').addEventListener('click', () => WoxTheme.toggle());
    }

    /** Update the icon to reflect the current theme. */
    _updateIcon() {
        const icon = this.$('.icon');
        if (!icon) return;
        const isDark = WoxTheme.get() === 'dark';
        icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        this.$('button').title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
}
