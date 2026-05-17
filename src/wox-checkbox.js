// wox-checkbox.js — Binary checkbox with custom-drawn SVG checkmark and inline label

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-block; }
    .wrapper {
        display: inline-flex; align-items: center; gap: 6px;
        cursor: pointer; user-select: none;
    }
    .wrapper.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
    .box {
        width: var(--wox-checkbox-size, 14px);
        height: var(--wox-checkbox-size, 14px);
        min-width: var(--wox-checkbox-size, 14px);
        background: var(--wox-checkbox-bg, var(--wox-bg-input, #1a1a1d));
        border: 1px solid var(--wox-checkbox-border, var(--wox-border, #333));
        border-radius: var(--wox-radius-sm, 3px);
        display: flex; align-items: center; justify-content: center;
        transition: background var(--wox-transition-fast, 0.12s), border-color var(--wox-transition-fast, 0.12s);
    }
    .wrapper:not(.disabled):hover .box {
        border-color: var(--wox-checkbox-checked-bg, var(--wox-accent, #00e5ff));
    }
    .box.checked {
        background: var(--wox-checkbox-checked-bg, var(--wox-accent, #00e5ff));
        border-color: var(--wox-checkbox-checked-bg, var(--wox-accent, #00e5ff));
    }
    svg.check {
        display: none;
        width: 70%; height: 70%;
        overflow: visible;
    }
    .box.checked svg.check { display: block; }
    svg.check polyline {
        fill: none;
        stroke: var(--wox-checkbox-check-color, #000);
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .label {
        font-size: var(--wox-font-size-base, 12px);
        color: var(--wox-text-primary, #eee);
        font-family: var(--wox-font, 'Inter', sans-serif);
        line-height: 1;
    }
`;

/**
 * <wox-checkbox> — Binary checkbox with inline SVG checkmark and clickable label.
 * @attr {boolean} checked  - Checked state (presence attr)
 * @attr {boolean} disabled - Disabled state
 * @attr {string}  label    - Text displayed to the right of the box
 * @attr {string}  value    - Payload included in wox-change event detail
 * @fires wox-change - Emitted on toggle, detail: { checked: boolean, value: string }
 */
class WoxCheckbox extends WoxElement {
    static observedAttributes = ['checked', 'disabled', 'label', 'value'];

    connectedCallback() {
        this._render();
        this.$('.wrapper').addEventListener('click', () => {
            if (this.hasAttribute('disabled')) return;
            const next = !this.hasAttribute('checked');
            if (next) this.setAttribute('checked', '');
            else this.removeAttribute('checked');
            this.emit('wox-change', { checked: next, value: this.getAttribute('value') || '' });
        });
    }

    attributeChangedCallback(name) {
        if (!this.isConnected) return;
        if (name === 'checked' || name === 'disabled') {
            this._updateState();
        } else {
            this._render();
        }
    }

    /** @returns {boolean} */
    get checked() {
        return this.hasAttribute('checked');
    }

    /** @param {boolean} v */
    set checked(v) {
        if (v) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
    }

    /** @private */
    _updateState = () => {
        const wrapper = this.$('.wrapper');
        const box = this.$('.box');
        if (!wrapper || !box) return;
        wrapper.classList.toggle('disabled', this.hasAttribute('disabled'));
        box.classList.toggle('checked', this.hasAttribute('checked'));
    };

    /** @private */
    _render = () => {
        const label = this.getAttribute('label') || '';

        this.render(STYLES, `
            <div class="wrapper">
                <div class="box">
                    <svg class="check" viewBox="0 0 10 8" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="1,4 4,7 9,1"/>
                    </svg>
                </div>
                ${label ? `<span class="label"></span>` : ''}
            </div>
        `);

        if (label) this.$('.label').textContent = label;
        this._updateState();
    };
}

export { WoxCheckbox };
