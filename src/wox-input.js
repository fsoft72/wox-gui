// wox-input.js — Text/number input with unit suffix and label drag-scrubbing

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-block; }
    .wrapper { display: flex; flex-direction: column; gap: 3px; }
    label {
        font-size: var(--wox-font-size-sm, 10px); color: var(--wox-text-secondary, #999);
        display: flex; justify-content: space-between; cursor: default; user-select: none;
    }
    label.scrub { cursor: ew-resize; }
    .unit { color: var(--wox-text-secondary, #999); font-size: var(--wox-font-size-sm, 10px); }
    .input-wrap { position: relative; display: flex; align-items: center; }
    input {
        background: var(--wox-bg-input, #1a1a1d); border: 1px solid var(--wox-border, #333);
        color: var(--wox-text-primary, #eee); padding: 6px 8px; border-radius: var(--wox-radius-md, 6px);
        font-size: var(--wox-font-size-md, 11px); font-family: var(--wox-font, sans-serif);
        width: 100%; transition: all var(--wox-transition-normal, 0.2s);
        box-shadow: var(--wox-shadow-input, inset 0 1px 3px rgba(0, 0, 0, 0.2));
    }
    input[type="number"] { text-align: right; }
    input:focus { outline: none; border-color: var(--wox-accent, #00e5ff); background: #222; box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.1), var(--wox-shadow-input, inset 0 1px 3px rgba(0, 0, 0, 0.2)); }
    input:disabled { opacity: 0.4; cursor: not-allowed; }
    input.has-unit { padding-right: 28px; }
    .suffix { position: absolute; right: 8px; font-size: var(--wox-font-size-sm, 10px); color: var(--wox-text-secondary, #999); pointer-events: none; }
`;

/**
 * <wox-input> — Text or number input with optional unit suffix and drag scrubbing.
 * @attr {string}  type     - "text" or "number" (default "text")
 * @attr {string}  value    - Current value
 * @attr {string}  unit     - Unit suffix displayed inside the field (e.g. "px", "%")
 * @attr {string}  label    - Label text above the input
 * @attr {number}  min      - Minimum value (number type)
 * @attr {number}  max      - Maximum value (number type)
 * @attr {number}  step     - Step value (number type)
 * @attr {string}  placeholder - Placeholder text
 * @attr {boolean} disabled - Disabled state
 * @fires wox-input  - On each keystroke, detail: { value }
 * @fires wox-change - On blur/enter, detail: { value }
 */
class WoxInput extends WoxElement {
    static observedAttributes = ['type', 'value', 'unit', 'label', 'min', 'max', 'step', 'placeholder', 'disabled'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name) {
        if (!this.isConnected) return;
        if (name === 'value') {
            const input = this.$('input');
            if (input && document.activeElement !== this) {
                input.value = this.getAttribute('value') || '';
            }
            return;
        }
        this._render();
    }

    /** @private */
    _render = () => {
        const type = this.getAttribute('type') || 'text';
        const value = this.getAttribute('value') || '';
        const unit = this.getAttribute('unit') || '';
        const label = this.getAttribute('label') || '';
        const min = this.getAttribute('min');
        const max = this.getAttribute('max');
        const step = this.getAttribute('step');
        const placeholder = this.getAttribute('placeholder') || '';
        const disabled = this.hasAttribute('disabled');

        const isNumber = type === 'number';
        const numAttrs = isNumber ? `${min !== null ? ` min="${min}"` : ''}${max !== null ? ` max="${max}"` : ''}${step !== null ? ` step="${step}"` : ''}` : '';

        this.render(STYLES, `
            <div class="wrapper">
                ${label ? `<label class="${isNumber ? 'scrub' : ''}">${label}${unit ? `<span class="unit">${unit}</span>` : ''}</label>` : ''}
                <div class="input-wrap">
                    <input type="${isNumber ? 'number' : 'text'}" value="${value}" placeholder="${placeholder}" ${numAttrs} ${disabled ? 'disabled' : ''} class="${unit && !label ? 'has-unit' : ''}">
                    ${unit && !label ? `<span class="suffix">${unit}</span>` : ''}
                </div>
            </div>
        `);

        const input = this.$('input');

        input.addEventListener('input', () => {
            const v = isNumber ? parseFloat(input.value) : input.value;
            this.emit('wox-input', { value: v });
        });

        input.addEventListener('change', () => {
            const v = isNumber ? parseFloat(input.value) : input.value;
            this.emit('wox-change', { value: v });
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });

        // Drag scrubbing on label for number inputs
        if (isNumber && label) {
            const lbl = this.$('label');
            let startX = 0, startVal = 0;

            const onMove = (e) => {
                const delta = e.clientX - startX;
                const stepVal = parseFloat(step) || 1;
                let newVal = startVal + Math.round(delta / 2) * stepVal;
                if (min !== null) newVal = Math.max(parseFloat(min), newVal);
                if (max !== null) newVal = Math.min(parseFloat(max), newVal);
                input.value = newVal;
                this.emit('wox-input', { value: newVal });
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                this.emit('wox-change', { value: parseFloat(input.value) });
            };

            lbl.addEventListener('mousedown', (e) => {
                if (disabled) return;
                startX = e.clientX;
                startVal = parseFloat(input.value) || 0;
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
                e.preventDefault();
            });
        }
    };
}

customElements.define('wox-input', WoxInput);
export { WoxInput };
