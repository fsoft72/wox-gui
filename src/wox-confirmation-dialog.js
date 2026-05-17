// wox-confirmation-dialog.js — Confirmation dialog that requires explicit button click to dismiss.
// Does NOT close on outside click or Escape key — forces user to choose a button.

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: none; }
    :host([open]) { display: block; }
    .overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(2px);
        z-index: var(--wox-z-modal, 20000); display: flex;
        align-items: center; justify-content: center;
    }
    .box {
        background: var(--wox-bg-toolbar, #1e1e24);
        border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-2xl, 12px);
        padding: 24px;
        min-width: 300px; max-width: var(--width, 400px);
        box-shadow: var(--wox-shadow-xl);
    }
    .title {
        font-size: var(--wox-font-size-2xl, 16px);
        color: var(--wox-text-hi, #fff);
        font-weight: 500;
        margin-bottom: 12px;
    }
    .body {
        color: var(--wox-text-primary, #bbb);
        font-size: var(--wox-font-size-xl, 14px);
        margin-bottom: 24px;
        line-height: 1.5;
    }
    .footer {
        display: flex;
        width: 100%;
        gap: 8px;
    }
    .btn {
        flex: 1;
        padding: 8px 16px;
        border-radius: var(--wox-radius-md, 6px);
        font-family: var(--wox-font, sans-serif);
        font-size: var(--wox-font-size-lg, 13px);
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: filter 0.15s;
        color: #fff;
    }
    .btn:hover { filter: brightness(0.85); }
    .btn-ok { background: var(--wox-accent, #00e5ff); color: #000; }
    .btn-cancel { background: var(--wox-border, #333); }
`;

/** @type {{ label: string, key: string }[]} */
const DEFAULT_BUTTONS = [
    { label: 'Ok', key: 'ok' },
    { label: 'Cancel', key: 'cancel' },
];

/**
 * <wox-confirmation-dialog> — Modal dialog requiring an explicit button click to dismiss.
 * Clicking outside the dialog or pressing Escape does NOT close it.
 *
 * @attr {boolean} open  - Show/hide the dialog (presence attribute)
 * @attr {string}  title - Dialog title text
 * @attr {string}  body  - HTML body content (alternative to slotted children)
 * @attr {string}  width - Max dialog width (default "400px")
 *
 * @fires wox-confirm - Fired when any button is clicked. Detail: { key: string, label: string }
 *
 * @slot default - Dialog body content (used when `body` attribute is not set)
 */
class WoxConfirmationDialog extends WoxElement {
    static observedAttributes = ['open', 'title', 'body', 'width'];

    constructor() {
        super();
        /** @type {{ label: string, key: string, color?: string, textColor?: string }[]} */
        this._buttons = [...DEFAULT_BUTTONS];
        /** @type {((key: string) => void) | null} */
        this._resolve = null;
        this._built = false;
    }

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name) {
        if (!this.isConnected) return;
        if (!this._built) { this._render(); return; }
        this._applyAttr(name);
    }

    /**
     * Apply a single attribute change in-place without full re-render.
     * @private
     * @param {string} name
     */
    _applyAttr = (name) => {
        switch (name) {
            case 'title': {
                const el = this.$('.title');
                if (el) el.textContent = this.getAttribute('title') || '';
                return;
            }
            case 'width': {
                const box = this.$('.box');
                if (box) box.style.setProperty('--width', this.getAttribute('width') || '400px');
                return;
            }
            case 'body': {
                const el = this.$('.body');
                if (el) el.innerHTML = this.getAttribute('body') || '';
                return;
            }
        }
    };

    /** @private */
    _render = () => {
        const width = this.getAttribute('width') || '400px';
        const hasBody = this.hasAttribute('body');
        const bodyHtml = hasBody ? (this.getAttribute('body') || '') : '';

        this.render(STYLES, `
            <div class="overlay">
                <div class="box" style="--width:${width}">
                    <div class="title"></div>
                    <div class="body">${hasBody ? '' : '<slot></slot>'}</div>
                    <div class="footer"></div>
                </div>
            </div>
        `);

        this.$('.title').textContent = this.getAttribute('title') || '';
        if (hasBody) this.$('.body').innerHTML = bodyHtml;

        this._renderButtons();
        this._built = true;

        // Overlay click intentionally does NOT close the dialog.
    };

    /** @private */
    _renderButtons = () => {
        const footer = this.$('.footer');
        if (!footer) return;
        footer.innerHTML = '';

        const buttons = this._buttons.length ? this._buttons : DEFAULT_BUTTONS;
        buttons.forEach((btn, i) => {
            const el = document.createElement('button');
            el.className = 'btn';
            el.textContent = btn.label;

            if (btn.color) {
                el.style.background = btn.color;
                el.style.color = btn.textColor || '#fff';
            } else if (i === 0) {
                el.classList.add('btn-ok');
            } else {
                el.classList.add('btn-cancel');
            }

            el.addEventListener('click', () => {
                this.removeAttribute('open');
                this.emit('wox-confirm', { key: btn.key, label: btn.label });
                if (this._resolve) {
                    const resolve = this._resolve;
                    this._resolve = null;
                    setTimeout(() => this.remove(), 300);
                    resolve(btn.key);
                }
            });

            footer.appendChild(el);
        });
    };

    /**
     * Button definitions. Each button: { label, key, color?, textColor? }.
     * First button is leftmost (default: Ok with accent color).
     * Last button is rightmost (default: Cancel with neutral color).
     * @type {{ label: string, key: string, color?: string, textColor?: string }[]}
     */
    get buttons() { return this._buttons; }
    set buttons(arr) {
        this._buttons = Array.isArray(arr) && arr.length ? arr : [...DEFAULT_BUTTONS];
        if (this._built) this._renderButtons();
    }

    /** HTML body content. Setting this replaces slotted content. */
    get body() { return this.getAttribute('body') || ''; }
    set body(val) { this.setAttribute('body', val || ''); }

    /** Opens the dialog. */
    open() { this.setAttribute('open', ''); }

    /** Closes the dialog. */
    close() { this.removeAttribute('open'); }

    get openState() { return this.hasAttribute('open'); }
    set openState(val) {
        if (val) this.setAttribute('open', '');
        else this.removeAttribute('open');
    }

    /**
     * Show a confirmation dialog and return a Promise that resolves with the clicked button key.
     * The dialog element is auto-appended to document.body and removed after dismissal.
     *
     * @param {{ title?: string, body?: string, buttons?: Array, width?: string }} [opts]
     * @returns {Promise<string>} Resolves with the `key` of the clicked button
     *
     * @example
     * const key = await WoxConfirmationDialog.show({
     *   title: 'Delete file?',
     *   body: '<p>This action <strong>cannot</strong> be undone.</p>',
     *   buttons: [
     *     { label: 'Delete', key: 'delete', color: 'var(--wox-danger)' },
     *     { label: 'Cancel', key: 'cancel' },
     *   ],
     * });
     * if (key === 'delete') performDelete();
     */
    static show(opts = {}) {
        return new Promise((resolve) => {
            const dialog = document.createElement('wox-confirmation-dialog');

            // Set _resolve and _buttons before connecting so _render picks them up.
            dialog._resolve = resolve;
            if (opts.buttons) dialog._buttons = opts.buttons;

            if (opts.title) dialog.setAttribute('title', opts.title);
            if (opts.body) dialog.setAttribute('body', opts.body);
            if (opts.width) dialog.setAttribute('width', opts.width);

            document.body.appendChild(dialog);
            dialog.setAttribute('open', '');
        });
    }
}

export { WoxConfirmationDialog };
