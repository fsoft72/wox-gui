// wox-slider.js — Range slider with custom track, thumb, and value display

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: inline-block; width: 100%; }
    .wrapper { display: flex; align-items: center; gap: var(--wox-space-lg, 12px); }
    .label {
        font-size: var(--wox-font-size-sm, 10px); color: var(--wox-text-secondary, #999);
        font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; min-width: 50px;
        user-select: none;
    }
    .track-wrap { flex: 1; position: relative; height: 20px; display: flex; align-items: center; cursor: pointer; }
    .track { width: 100%; height: 4px; background: var(--wox-border, #333); border-radius: 2px; position: relative; overflow: hidden; }
    .fill { height: 100%; background: var(--wox-accent, #00e5ff); border-radius: 2px; transition: width 0.05s; }
    .thumb {
        position: absolute; top: 50%; width: 14px; height: 14px; border-radius: 50%;
        background: var(--wox-text-hi, #fff); border: 2px solid var(--wox-accent, #00e5ff);
        transform: translate(-50%, -50%); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        transition: box-shadow 0.15s; pointer-events: none;
    }
    .thumb:hover, .thumb.dragging { box-shadow: 0 0 8px rgba(0, 229, 255, 0.4); }
    .value {
        font-size: var(--wox-font-size-base, 12px); color: var(--wox-text-secondary, #999);
        font-weight: 600; min-width: 35px; text-align: right; user-select: none;
    }
`;

/**
 * <wox-slider> — Custom range slider with accent fill and optional value display.
 * @attr {number}  value      - Current value
 * @attr {number}  min        - Minimum (default 0)
 * @attr {number}  max        - Maximum (default 100)
 * @attr {number}  step       - Step increment (default 1)
 * @attr {string}  label      - Label text on the left
 * @attr {string}  unit       - Unit suffix for value display (e.g. "%")
 * @attr {boolean} show-value - Show numeric value on the right
 * @fires wox-input  - On drag, detail: { value }
 * @fires wox-change - On drag end, detail: { value }
 */
class WoxSlider extends WoxElement {
    static observedAttributes = ['value', 'min', 'max', 'step', 'label', 'unit', 'show-value'];

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this._render();
    }

    /** @private */
    _render = () => {
        const min = parseFloat(this.getAttribute('min') ?? 0);
        const max = parseFloat(this.getAttribute('max') ?? 100);
        const step = parseFloat(this.getAttribute('step') ?? 1);
        const value = parseFloat(this.getAttribute('value') ?? min);
        const label = this.getAttribute('label') || '';
        const unit = this.getAttribute('unit') || '';
        const showValue = this.hasAttribute('show-value');
        const pct = ((value - min) / (max - min)) * 100;

        const formatVal = () => {
            const v = parseFloat(this.getAttribute('value') ?? min);
            if (unit === '%') return Math.round(v * 100) + '%';
            return step < 1 ? v.toFixed(2) : String(v);
        };

        this.render(STYLES, `
            <div class="wrapper">
                ${label ? `<span class="label">${label}</span>` : ''}
                <div class="track-wrap">
                    <div class="track"><div class="fill" style="width:${pct}%"></div></div>
                    <div class="thumb" style="left:${pct}%"></div>
                </div>
                ${showValue ? `<span class="value">${formatVal()}</span>` : ''}
            </div>
        `);

        const trackWrap = this.$('.track-wrap');
        const fill = this.$('.fill');
        const thumb = this.$('.thumb');
        const valueEl = this.$('.value');

        const update = (clientX) => {
            const rect = trackWrap.getBoundingClientRect();
            let ratio = (clientX - rect.left) / rect.width;
            ratio = Math.max(0, Math.min(1, ratio));
            let newVal = min + ratio * (max - min);
            newVal = Math.round(newVal / step) * step;
            newVal = Math.max(min, Math.min(max, newVal));
            const newPct = ((newVal - min) / (max - min)) * 100;
            fill.style.width = newPct + '%';
            thumb.style.left = newPct + '%';
            if (valueEl) {
                if (unit === '%') valueEl.textContent = Math.round(newVal * 100) + '%';
                else valueEl.textContent = step < 1 ? newVal.toFixed(2) : String(newVal);
            }
            this.setAttribute('value', newVal);
            return newVal;
        };

        const onMove = (e) => {
            const v = update(e.clientX);
            this.emit('wox-input', { value: v });
        };

        const onUp = (e) => {
            thumb.classList.remove('dragging');
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            const v = update(e.clientX);
            this.emit('wox-change', { value: v });
        };

        trackWrap.addEventListener('mousedown', (e) => {
            thumb.classList.add('dragging');
            const v = update(e.clientX);
            this.emit('wox-input', { value: v });
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            e.preventDefault();
        });
    };
}

customElements.define('wox-slider', WoxSlider);
export { WoxSlider };
