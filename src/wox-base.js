// wox-base.js — Base class for all WOX web components

/**
 * Common reset styles shared by all WOX components.
 * Applied inside each component's Shadow DOM.
 */
const BASE_STYLES = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :host { display: inline-block; font-family: var(--wox-font, 'Inter', sans-serif); color: var(--wox-text-primary, #eee); font-size: var(--wox-font-size-base, 12px); }
    :host([hidden]) { display: none !important; }
`;

/**
 * WoxElement — minimal base class for WOX web components.
 * Provides shadow root setup, rendering helpers, event emission, and query shortcuts.
 * @extends HTMLElement
 */
export class WoxElement extends HTMLElement {
    /** Common CSS reset applied inside every component's Shadow DOM */
    static BASE_STYLES = BASE_STYLES;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * Sets the shadow root innerHTML from CSS + HTML strings.
     * @param {string} css  - Component-specific CSS
     * @param {string} html - Component markup
     */
    render = (css, html) => {
        this.shadowRoot.innerHTML = `<style>${WoxElement.BASE_STYLES}${css}</style>${html}`;
    };

    /**
     * Dispatches a composed, bubbling CustomEvent.
     * @param {string} name   - Event name
     * @param {*}      detail - Event payload
     */
    emit = (name, detail) => {
        this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    };

    /**
     * Query shortcut for a single element inside the shadow root.
     * @param {string} sel - CSS selector
     * @returns {Element|null}
     */
    $ = (sel) => this.shadowRoot.querySelector(sel);

    /**
     * Query shortcut for all matching elements inside the shadow root.
     * @param {string} sel - CSS selector
     * @returns {NodeList}
     */
    $$ = (sel) => this.shadowRoot.querySelectorAll(sel);
}
