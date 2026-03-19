// wox-theme.js — Theme utility for switching between dark and light modes

const STORAGE_KEY = 'wox-theme';
const ATTR = 'woxTheme';
const EVENT_NAME = 'wox-theme-change';

/**
 * WoxTheme — static utility class for programmatic theme control.
 * Manages the `data-wox-theme` attribute on `<html>`, persists to localStorage,
 * and dispatches `wox-theme-change` events on `document.documentElement`.
 */
export class WoxTheme {

    /**
     * Get the current theme.
     * @returns {'dark' | 'light'}
     */
    static get = () => {
        return document.documentElement.dataset[ATTR] === 'light' ? 'light' : 'dark';
    };

    /**
     * Set the theme. Updates the data attribute, persists to localStorage,
     * and dispatches a `wox-theme-change` event.
     * @param {'dark' | 'light'} theme
     */
    static set = (theme) => {
        if (theme !== 'dark' && theme !== 'light') return;

        if (theme === 'light') {
            document.documentElement.dataset[ATTR] = 'light';
        } else {
            delete document.documentElement.dataset[ATTR];
        }

        try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) { /* storage unavailable */ }

        document.documentElement.dispatchEvent(
            new CustomEvent(EVENT_NAME, { detail: { theme }, bubbles: true, composed: true })
        );
    };

    /**
     * Toggle between dark and light themes.
     */
    static toggle = () => {
        WoxTheme.set(WoxTheme.get() === 'dark' ? 'light' : 'dark');
    };

    /**
     * Apply the OS color scheme preference, but only if no saved localStorage value exists.
     * If a saved value is found, it applies the saved value instead.
     */
    static auto = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'dark' || saved === 'light') {
                WoxTheme.set(saved);
                return;
            }
        } catch (_) { /* storage unavailable */ }

        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        WoxTheme.set(prefersLight ? 'light' : 'dark');
    };
}
