// wox-panel.js — Side panel container with optional resize

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host {
        display: flex; flex-direction: column; flex-shrink: 0; position: relative;
        width: var(--width, 280px); height: 100%;
        background: var(--wox-bg-panel, #17171a);
        border-left: 1px solid var(--wox-border-light, #444);
        z-index: var(--wox-z-base, 1);
    }
    :host([position="left"]) { border-left: none; border-right: 1px solid var(--wox-border-light, #444); }
    .resizer {
        position: absolute; top: 0; bottom: 0; width: 5px; cursor: col-resize;
        z-index: 2; transition: background 0.2s;
    }
    :host([position="left"]) .resizer { right: -2px; }
    :host(:not([position="left"])) .resizer { left: -2px; }
    .resizer:hover { background: rgba(0, 229, 255, 0.4); }
    .content { flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; }
`;

/**
 * <wox-panel> — Side panel container.
 * @attr {string}  width     - Panel width (default "280px")
 * @attr {string}  position  - "right" (default) or "left"
 * @attr {boolean} resizable - Enable drag-to-resize
 * @slot default - Panel content
 */
class WoxPanel extends WoxElement {
    static observedAttributes = ['width', 'position', 'resizable'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const width = this.getAttribute('width') || '280px';
        const resizable = this.hasAttribute('resizable');

        this.render(
            `${STYLES} :host { --width: ${width}; }`,
            `${resizable ? '<div class="resizer"></div>' : ''}<div class="content"><slot></slot></div>`
        );

        if (resizable) {
            const resizer = this.$('.resizer');
            if (!resizer) return;

            let startX = 0, startW = 0;
            const isLeft = this.getAttribute('position') === 'left';

            const onMove = (e) => {
                const delta = isLeft ? (e.clientX - startX) : (startX - e.clientX);
                const newW = Math.max(180, Math.min(600, startW + delta));
                this.style.width = newW + 'px';
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };

            resizer.addEventListener('mousedown', (e) => {
                startX = e.clientX;
                startW = this.getBoundingClientRect().width;
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
                e.preventDefault();
            });
        }
    };
}

export { WoxPanel };
