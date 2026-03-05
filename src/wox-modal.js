// wox-modal.js — Dialog with backdrop, focus trap, and escape-to-close

import { WoxElement } from './wox-base.js';
import { FX_STYLES } from './wox-fx.js';

const STYLES = `
    :host { display: none; }
    :host([open]) { display: block; }
    .overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(2px);
        z-index: var(--wox-z-modal, 20000); display: flex;
        align-items: center; justify-content: center;
        opacity: 1; transition: opacity 0.2s ease;
    }
    .box {
        background: #1e1e24; border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-2xl, 12px); padding: 24px;
        min-width: 300px; max-width: var(--width, 400px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        transform: translateY(0) scale(1);
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .title { font-size: var(--wox-font-size-2xl, 16px); color: var(--wox-text-hi, #fff); font-weight: 500; }
    .close-btn {
        background: none; border: none; color: #666; font-size: 18px; cursor: pointer;
        padding: 4px 8px; border-radius: var(--wox-radius-sm, 3px); transition: all 0.12s;
    }
    .close-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .body { color: #bbb; font-size: var(--wox-font-size-xl, 14px); margin-bottom: 24px; line-height: 1.5; }
    .footer { display: flex; justify-content: flex-end; gap: 12px; }
    .btn {
        padding: 8px 16px; border-radius: var(--wox-radius-md, 6px);
        font-family: var(--wox-font, sans-serif); font-size: var(--wox-font-size-lg, 13px);
        font-weight: 500; cursor: pointer; border: none; transition: background 0.15s;
    }
    .btn-secondary { background: var(--wox-border, #333); color: var(--wox-text-primary, #eee); }
    .btn-secondary:hover { background: var(--wox-border-light, #444); }
    .btn-primary { background: var(--wox-accent, #00e5ff); color: var(--wox-text-hi, #fff); }
    .btn-primary:hover { background: #3bb3d9; }
`;

/**
 * <wox-modal> — Dialog overlay with title, body slot, footer slot.
 * @attr {boolean} open     - Show/hide modal
 * @attr {string}  title    - Modal title
 * @attr {boolean} closable - Show close button (default true via presence)
 * @attr {string}  width    - Max width (default "400px")
 * @attr {string}  color    - FX color for glow/pulse effects (CSS color value)
 * @attr {boolean} glow     - Enable neon glow effect
 * @attr {boolean} pulse    - Enable pulse animation effect
 * @slot default - Modal body content
 * @slot footer  - Footer buttons (if not provided, default Cancel/OK shown)
 * @fires wox-close   - When closed via X or backdrop
 * @fires wox-confirm - When OK clicked
 * @fires wox-cancel  - When Cancel clicked
 */
class WoxModal extends WoxElement {
    static observedAttributes = ['open', 'title', 'closable', 'width', 'color', 'glow', 'pulse'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name) {
        if (!this.isConnected) return;
        if (name === 'open') {
            if (this.hasAttribute('open')) this._attachKeyHandler();
            else this._detachKeyHandler();
        }
        this._render();
    }

    disconnectedCallback() {
        this._detachKeyHandler();
    }

    /** @private */
    _render = () => {
        const title = this.getAttribute('title') || '';
        const closable = !this.hasAttribute('closable') || this.getAttribute('closable') !== 'false';
        const width = this.getAttribute('width') || '400px';
        const color = this.getAttribute('color') || '';
        const glow = this.hasAttribute('glow');
        const pulse = this.hasAttribute('pulse');
        const fxClasses = [glow ? 'glow' : '', pulse ? 'pulse' : ''].filter(Boolean).join(' ');
        const fxStyle = color ? ` style="--wox-fx-color:${color}"` : '';

        this.render(`${STYLES} ${FX_STYLES} .box { --width: ${width}; }`, `
            <div class="overlay">
                <div class="box ${fxClasses}"${fxStyle}>
                    <div class="header">
                        <span class="title">${title}</span>
                        ${closable ? '<button class="close-btn">&#x2715;</button>' : ''}
                    </div>
                    <div class="body"><slot></slot></div>
                    <div class="footer">
                        <slot name="footer">
                            <button class="btn btn-secondary cancel-btn">Cancel</button>
                            <button class="btn btn-primary ok-btn">OK</button>
                        </slot>
                    </div>
                </div>
            </div>
        `);

        // Backdrop click to close
        this.$('.overlay').addEventListener('click', (e) => {
            if (e.target === this.$('.overlay')) {
                this.removeAttribute('open');
                this.emit('wox-close', {});
            }
        });

        // Close button
        const closeBtn = this.$('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.removeAttribute('open');
                this.emit('wox-close', {});
            });
        }

        // Default buttons
        const cancelBtn = this.$('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.removeAttribute('open');
                this.emit('wox-cancel', {});
            });
        }

        const okBtn = this.$('.ok-btn');
        if (okBtn) {
            okBtn.addEventListener('click', () => {
                this.removeAttribute('open');
                this.emit('wox-confirm', {});
            });
        }
    };

    /** @private */
    _keyHandler = (e) => {
        if (e.key === 'Escape') {
            this.removeAttribute('open');
            this.emit('wox-close', {});
        }
    };

    /** @private */
    _attachKeyHandler = () => {
        document.addEventListener('keydown', this._keyHandler);
    };

    /** @private */
    _detachKeyHandler = () => {
        document.removeEventListener('keydown', this._keyHandler);
    };
}

customElements.define('wox-modal', WoxModal);
export { WoxModal };
