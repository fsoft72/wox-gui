// wox-color-picker.js — HSV wheel color picker with alpha and hex input (ported from colorpicker.js)

import { WoxElement } from './wox-base.js';

const WHEEL_SIZE = 220;
const OUTER_R = 104;
const INNER_R = 78;
const SQ_SIZE = 104;
const ALPHA_W = 192;
const ALPHA_H = 14;

const STYLES = `
    :host { display: block; }
    .cp-popup {
        position: fixed; z-index: var(--wox-z-modal, 20000);
        flex-direction: column; align-items: center; gap: 12px;
        background: var(--wox-bg-panel, #17171a); border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-2xl, 12px); padding: 16px;
        box-shadow: var(--wox-shadow-xl), 0 0 0 1px rgba(255, 255, 255, 0.04);
        width: 252px; user-select: none; overflow: hidden; display: none;
    }
    .cp-popup.open { display: flex; }
    .cp-header {
        width: calc(100% + 32px); margin: -16px -16px 12px -16px; padding: 10px 16px;
        background: var(--wox-bg-section-header, #22222a); border-bottom: 1px solid var(--wox-border-section, #2e2e2e);
        display: flex; justify-content: space-between; align-items: center; cursor: move;
    }
    .cp-title { font-size: var(--wox-font-size-base, 12px); font-weight: 600; color: #c0c0c0; letter-spacing: 0.5px; text-transform: uppercase; }
    .cp-close {
        background: none; border: none; color: #666; cursor: pointer; font-size: 14px;
        padding: 2px 6px; border-radius: var(--wox-radius-sm, 3px); transition: all var(--wox-transition-fast);
    }
    .cp-close:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .cp-wheel { border-radius: 50%; cursor: crosshair; display: block; }
    .cp-alpha-wrap { width: ${ALPHA_W}px; position: relative; height: ${ALPHA_H}px; border-radius: 7px; cursor: pointer; }
    .cp-alpha-canvas { display: block; border-radius: 7px; width: ${ALPHA_W}px; height: ${ALPHA_H}px; }
    .cp-alpha-knob {
        position: absolute; top: -3px; width: 20px; height: 20px; border-radius: 50%;
        border: 2.5px solid #fff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
        background: transparent; pointer-events: none;
    }
    .cp-bottom { width: 100%; display: flex; align-items: center; gap: 10px; }
    .cp-preview {
        width: 34px; height: 34px; border-radius: var(--wox-radius-lg, 8px);
        border: 2px solid rgba(255, 255, 255, 0.12); flex-shrink: 0;
        background: repeating-conic-gradient(#888 0% 25%, #fff 0% 50%) 0 0 / 8px 8px;
    }
    .cp-hexwrap { flex: 1; display: flex; flex-direction: column; gap: 3px; }
    .cp-hex {
        background: #27272b; border: 1px solid var(--wox-border-light, #444);
        border-radius: var(--wox-radius-md, 6px); color: #e8e8e8;
        font-size: var(--wox-font-size-base, 12px); font-family: var(--wox-font-mono, monospace);
        padding: 6px 8px; width: 100%; transition: border var(--wox-transition-fast);
    }
    .cp-hex:focus { outline: none; border-color: var(--wox-accent, #00e5ff); }
    .cp-hex-label { font-size: var(--wox-font-size-xs, 9px); color: #555; letter-spacing: 1px; text-align: center; text-transform: uppercase; }
`;

/**
 * <wox-color-picker> — HSV wheel color picker popup.
 * @attr {string}  color - Initial color as CSS hex (#rrggbb)
 * @attr {number}  alpha - Alpha value 0-1 (default 1)
 * @attr {boolean} open  - Show/hide the picker
 * @fires wox-color-change - detail: { color: [r,g,b,a] } normalized 0-1
 * @fires wox-color-close  - When close button clicked
 */
class WoxColorPicker extends WoxElement {
    static observedAttributes = ['color', 'alpha', 'open'];

    constructor() {
        super();
        this._hue = 0;
        this._sat = 0.8;
        this._val = 0.9;
        this._alpha = 1;
        this._dragging = null;
        this._dragState = null;
        this._built = false;
    }

    connectedCallback() {
        this._build();
    }

    attributeChangedCallback(name) {
        if (!this.isConnected) return;
        if (name === 'open') {
            const popup = this.$('.cp-popup');
            if (popup) {
                if (this.hasAttribute('open')) {
                    popup.classList.add('open');
                    this._initFromAttrs();
                    this._redraw();
                } else {
                    popup.classList.remove('open');
                }
            }
        } else if (name === 'color' || name === 'alpha') {
            this._initFromAttrs();
            if (this.hasAttribute('open')) this._redraw();
        }
    }

    /** @private */
    _initFromAttrs = () => {
        const hex = this.getAttribute('color');
        if (hex && /^#[0-9a-fA-F]{6}$/.test(hex)) {
            const [r, g, b] = this._hexToRgb(hex);
            [this._hue, this._sat, this._val] = this._rgbToHsv(r, g, b);
        }
        const a = this.getAttribute('alpha');
        if (a !== null) this._alpha = parseFloat(a);
    };

    /** @private */
    _build = () => {
        if (this._built) return;
        this._built = true;

        this.render(STYLES, `
            <div class="cp-popup">
                <div class="cp-header">
                    <span class="cp-title">Color</span>
                    <button class="cp-close">&#x2715;</button>
                </div>
                <canvas class="cp-wheel" width="${WHEEL_SIZE}" height="${WHEEL_SIZE}"></canvas>
                <div class="cp-alpha-wrap">
                    <canvas class="cp-alpha-canvas" width="${ALPHA_W}" height="${ALPHA_H}"></canvas>
                    <div class="cp-alpha-knob"></div>
                </div>
                <div class="cp-bottom">
                    <div class="cp-preview"></div>
                    <div class="cp-hexwrap">
                        <input class="cp-hex" type="text" maxlength="9" spellcheck="false">
                        <span class="cp-hex-label">HEX</span>
                    </div>
                </div>
            </div>
        `);

        this._wheelCanvas = this.$('.cp-wheel');
        this._wCtx = this._wheelCanvas.getContext('2d');
        this._alphaCanvas = this.$('.cp-alpha-canvas');
        this._aCtx = this._alphaCanvas.getContext('2d');
        this._alphaKnob = this.$('.cp-alpha-knob');
        this._preview = this.$('.cp-preview');
        this._hexInput = this.$('.cp-hex');
        this._popup = this.$('.cp-popup');

        // Close button
        this.$('.cp-close').addEventListener('click', () => {
            this.removeAttribute('open');
            this.emit('wox-color-close', {});
        });

        // Prevent closing on click inside
        this._popup.addEventListener('mousedown', (e) => e.stopPropagation());

        // Wheel interaction
        this._wheelCanvas.addEventListener('mousedown', (e) => this._wheelDown(e));

        // Alpha drag
        this.$('.cp-alpha-wrap').addEventListener('mousedown', (e) => {
            this._dragging = 'alpha';
            this._doAlpha(e);
            e.preventDefault();
        });

        // Global handlers
        document.addEventListener('mousemove', (e) => {
            this._mouseMove(e);
            if (this._dragState) {
                this._popup.style.left = (e.clientX - this._dragState.dx) + 'px';
                this._popup.style.top = (e.clientY - this._dragState.dy) + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            this._dragging = null;
            this._dragState = null;
        });

        // Header drag for popup repositioning
        this.$('.cp-header').addEventListener('mousedown', (e) => {
            if (e.target.closest('.cp-close')) return;
            const r = this._popup.getBoundingClientRect();
            this._dragState = { dx: e.clientX - r.left, dy: e.clientY - r.top };
            e.preventDefault();
        });

        // Hex input
        this._hexInput.addEventListener('input', (e) => {
            const v = e.target.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                const [r, g, b] = this._hexToRgb(v);
                [this._hue, this._sat, this._val] = this._rgbToHsv(r, g, b);
                this._redraw();
                this._emitColor();
            }
        });

        if (this.hasAttribute('open')) {
            this._popup.classList.add('open');
            this._initFromAttrs();
            this._redraw();
        }
    };

    /**
     * Positions and opens the picker near an anchor element.
     * @param {HTMLElement} anchorEl - Element to anchor near
     */
    showAt = (anchorEl) => {
        const rect = anchorEl.getBoundingClientRect();
        const pickW = 252, pickH = 320;
        let left = rect.left + rect.width / 2 - pickW / 2;
        let top = rect.top - pickH - 10;
        if (top < 10) top = rect.bottom + 10;
        if (left < 10) left = 10;
        if (left + pickW > window.innerWidth - 10) left = window.innerWidth - pickW - 10;
        if (top + pickH > window.innerHeight - 10) top = window.innerHeight - pickH - 10;
        this._popup.style.left = left + 'px';
        this._popup.style.top = top + 'px';
        this.setAttribute('open', '');
    };

    /** @private */
    _redraw = () => {
        this._drawWheel();
        this._drawAlpha();
        this._updatePreview();
    };

    /** @private */
    _drawWheel = () => {
        const ctx = this._wCtx, S = WHEEL_SIZE;
        const cx = S / 2, cy = S / 2;
        ctx.clearRect(0, 0, S, S);
        const conic = ctx.createConicGradient(-Math.PI / 2, cx, cy);
        for (let i = 0; i <= 36; i++) conic.addColorStop(i / 36, `hsl(${i * 10},100%,50%)`);
        ctx.fillStyle = conic;
        ctx.beginPath(); ctx.arc(cx, cy, OUTER_R, 0, Math.PI * 2); ctx.fill();
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(cx, cy, INNER_R, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, OUTER_R - 0.5, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, INNER_R + 0.5, 0, Math.PI * 2); ctx.stroke();
        const hAngle = this._hue * Math.PI * 2 - Math.PI / 2;
        const rMid = (OUTER_R + INNER_R) / 2;
        const kx = cx + Math.cos(hAngle) * rMid;
        const ky = cy + Math.sin(hAngle) * rMid;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(kx, ky, 8, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(kx, ky, 8, 0, Math.PI * 2); ctx.stroke();
        const sq = SQ_SIZE, sx = cx - sq / 2, sy = cy - sq / 2;
        const sGrad = ctx.createLinearGradient(sx, 0, sx + sq, 0);
        sGrad.addColorStop(0, '#fff');
        sGrad.addColorStop(1, `hsl(${this._hue * 360},100%,50%)`);
        ctx.fillStyle = sGrad; ctx.fillRect(sx, sy, sq, sq);
        const vGrad = ctx.createLinearGradient(0, sy, 0, sy + sq);
        vGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vGrad.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = vGrad; ctx.fillRect(sx, sy, sq, sq);
        const ix = sx + this._sat * sq;
        const iy = sy + (1 - this._val) * sq;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(ix, iy, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ix, iy, 7, 0, Math.PI * 2); ctx.stroke();
    };

    /** @private */
    _drawAlpha = () => {
        const ctx = this._aCtx;
        ctx.clearRect(0, 0, ALPHA_W, ALPHA_H);
        for (let x = 0; x < ALPHA_W; x += 8) for (let y = 0; y < ALPHA_H; y += 8) {
            ctx.fillStyle = ((x / 8 + y / 8) % 2 === 0) ? '#aaa' : '#fff';
            ctx.fillRect(x, y, 8, 8);
        }
        const [r, g, b] = this._hsvToRgb(this._hue, this._sat, this._val);
        const grad = ctx.createLinearGradient(0, 0, ALPHA_W, 0);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},1)`);
        ctx.fillStyle = grad; ctx.fillRect(0, 0, ALPHA_W, ALPHA_H);
        this._alphaKnob.style.left = (this._alpha * ALPHA_W - 7) + 'px';
    };

    /** @private */
    _updatePreview = () => {
        const [r, g, b] = this._hsvToRgb(this._hue, this._sat, this._val);
        this._preview.style.background = `rgba(${r},${g},${b},${this._alpha})`;
        this._hexInput.value = this._rgbToHex(r, g, b);
    };

    /** @private */
    _wheelDown = (e) => {
        const rect = this._wheelCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const cx = WHEEL_SIZE / 2, cy = WHEEL_SIZE / 2;
        const dist = Math.hypot(mx - cx, my - cy);
        if (dist >= INNER_R - 2 && dist <= OUTER_R + 2) this._dragging = 'ring';
        else if (dist < INNER_R) this._dragging = 'sq';
        this._handleWheel(mx, my);
    };

    /** @private */
    _mouseMove = (e) => {
        if (!this._dragging) return;
        if (this._dragging === 'ring' || this._dragging === 'sq') {
            const rect = this._wheelCanvas.getBoundingClientRect();
            this._handleWheel(e.clientX - rect.left, e.clientY - rect.top);
        } else if (this._dragging === 'alpha') {
            this._doAlpha(e);
        }
    };

    /** @private */
    _handleWheel = (mx, my) => {
        const cx = WHEEL_SIZE / 2, cy = WHEEL_SIZE / 2;
        if (this._dragging === 'ring') {
            const angle = Math.atan2(my - cy, mx - cx) + Math.PI / 2;
            this._hue = ((angle / (Math.PI * 2)) % 1 + 1) % 1;
        } else if (this._dragging === 'sq') {
            const sx = cx - SQ_SIZE / 2, sy = cy - SQ_SIZE / 2;
            this._sat = Math.max(0, Math.min(1, (mx - sx) / SQ_SIZE));
            this._val = Math.max(0, Math.min(1, 1 - (my - sy) / SQ_SIZE));
        }
        this._redraw();
        this._emitColor();
    };

    /** @private */
    _doAlpha = (e) => {
        const rect = this.$('.cp-alpha-wrap').getBoundingClientRect();
        this._alpha = Math.max(0, Math.min(1, (e.clientX - rect.left) / ALPHA_W));
        this._drawAlpha();
        this._updatePreview();
        this._emitColor();
    };

    /** @private */
    _emitColor = () => {
        const [r, g, b] = this._hsvToRgb(this._hue, this._sat, this._val);
        this.emit('wox-color-change', { color: [r / 255, g / 255, b / 255, this._alpha] });
    };

    // ── Color math ──
    /** @private */
    _hsvToRgb = (h, s, v) => {
        const f = (n) => { const k = (n + h * 6) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
        return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
    };

    /** @private */
    _rgbToHsv = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
        let h = 0;
        if (d) {
            if (max === r) h = ((g - b) / d % 6 + 6) % 6;
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
        }
        return [h / 6, max ? d / max : 0, max];
    };

    /** @private */
    _hexToRgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

    /** @private */
    _rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

export { WoxColorPicker };
