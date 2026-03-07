// wox-gradient-editor.js — Interactive gradient color-stop editor component

import { WoxElement } from './wox-base.js';

/** Minimum number of stops required (cannot remove below this) */
const MIN_STOPS = 2;

/** Vertical drag distance in px that triggers stop removal */
const REMOVE_THRESHOLD = 40;

/** Horizontal/vertical drag distance in px that counts as a drag (prevents color picker open) */
const DRAG_THRESHOLD = 3;

/**
 * Convert a gradient object to a CSS gradient string.
 * @param {{ type: string, angle: number, stops: Array<{color: string, position: number}> }} gradient
 * @returns {string} CSS gradient value
 */
export const gradientToCSS = (gradient) => {
    if ( ! gradient || ! gradient.stops || gradient.stops.length < 2 ) return '';

    const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

    if ( gradient.type === 'linear' ) {
        return `linear-gradient(${gradient.angle}deg, ${stopsStr})`;
    }

    return `radial-gradient(circle, ${stopsStr})`;
};

/**
 * Parse a CSS gradient string into a gradient object.
 * @param {string} css - CSS gradient string
 * @returns {{ type: string, angle: number, stops: Array<{color: string, position: number}> }|null}
 */
export const cssToGradient = (css) => {
    if ( ! css ) return null;

    let type = null;
    let angle = 90;
    let stopsStr = null;

    const linearMatch = css.match(/^linear-gradient\(\s*(\d+)deg\s*,\s*(.+)\)$/i);
    if ( linearMatch ) {
        type = 'linear';
        angle = parseInt(linearMatch[1], 10);
        stopsStr = linearMatch[2];
    }

    if ( ! type ) {
        const radialMatch = css.match(/^radial-gradient\(\s*(?:circle|ellipse)?\s*,?\s*(.+)\)$/i);
        if ( radialMatch ) {
            type = 'radial';
            stopsStr = radialMatch[1];
        }
    }

    if ( ! type || ! stopsStr ) return null;

    const stops = [];
    const stopRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s+(\d+(?:\.\d+)?)%/g;
    let match;
    while ( (match = stopRegex.exec(stopsStr)) !== null ) {
        stops.push({
            color: match[1],
            position: parseFloat(match[2])
        });
    }

    if ( stops.length < 2 ) return null;

    return { type, angle, stops };
};

const STYLES = `
    :host { display: block; }
    .editor { padding: var(--wox-space-md, 8px) 0; }
    .bar-wrapper { position: relative; margin-bottom: var(--wox-space-md, 8px); }
    .bar {
        height: 24px; border-radius: var(--wox-radius-sm, 3px);
        border: 1px solid var(--wox-border, #333); cursor: crosshair;
    }
    .stops { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
    .handle {
        position: absolute; top: 50%; width: 14px; height: 14px;
        border: 2px solid var(--wox-bg-panel, #17171a);
        border-radius: 2px; cursor: grab; transform: translate(-50%, -50%);
        pointer-events: auto; transition: box-shadow 0.15s, transform 0.15s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.6); z-index: 1;
    }
    .handle:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.7); transform: translate(-50%,-50%) scale(1.15); }
    .handle.dragging { cursor: grabbing; box-shadow: 0 3px 8px rgba(0,0,0,0.8); transform: translate(-50%,-50%) scale(1.2); z-index: 10; }
    .handle.removing { opacity: 0.4; border-color: var(--wox-danger, #f72585); box-shadow: 0 2px 6px rgba(247,37,133,0.4); }
    .color-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; pointer-events: none; }
    .hint { font-size: var(--wox-font-size-xs, 9px); color: var(--wox-text-secondary, #999); text-align: center; margin-top: var(--wox-space-sm, 4px); }
`;

/**
 * <wox-gradient-editor> — Interactive gradient color-stop editor.
 *
 * Data is set via JavaScript property:
 *   editor.gradient = { type: 'linear'|'radial', angle: number, stops: [{color, position}] }
 *
 * @fires wox-gradient-input  - { gradient, css } continuous during drag
 * @fires wox-gradient-change - { gradient, css } on mouseup, stop add, stop remove
 */
class WoxGradientEditor extends WoxElement {
    /** @private */
    _gradient = null;
    /** @private */
    _dragging = null;
    /** @private */
    _justDragged = false;

    connectedCallback() {
        if ( this._gradient ) this._build();
    }

    /**
     * Sets the gradient data and re-renders the editor.
     * @param {{ type: string, angle: number, stops: Array<{color: string, position: number}> }} g
     */
    set gradient(g) {
        this._gradient = JSON.parse(JSON.stringify(g));
        if ( this.isConnected ) this._build();
    }

    /**
     * Returns a deep copy of the current gradient data.
     * @returns {{ type: string, angle: number, stops: Array<{color: string, position: number}> }|null}
     */
    get gradient() {
        return this._gradient ? JSON.parse(JSON.stringify(this._gradient)) : null;
    }

    /**
     * Builds the full editor DOM and binds all events.
     * @private
     */
    _build = () => {
        if ( ! this._gradient ) return;

        const cssGrad = gradientToCSS(this._gradient);

        this.render(STYLES, `
            <div class="editor">
                <div class="bar-wrapper">
                    <div class="bar" style="background: ${cssGrad}"></div>
                    <div class="stops"></div>
                </div>
                <div class="hint">Double-click bar to add stop &middot; Drag down to remove</div>
            </div>
        `);

        this._renderStops();
        this._bindBarEvents();
    };

    /**
     * Updates the gradient bar preview background.
     * @private
     */
    _updatePreview = () => {
        const bar = this.$('.bar');
        if ( ! bar ) return;
        bar.style.background = gradientToCSS(this._gradient);
    };

    /**
     * Emits a gradient event with current state.
     * @private
     * @param {string} eventName - Event name to dispatch
     */
    _emitGradient = (eventName) => {
        this.emit(eventName, {
            gradient: this.gradient,
            css: gradientToCSS(this._gradient)
        });
    };

    /**
     * Renders all color stop handles into the stops container.
     * @private
     */
    _renderStops = () => {
        const stopsContainer = this.$('.stops');
        if ( ! stopsContainer ) return;

        stopsContainer.innerHTML = '';
        const sorted = [...this._gradient.stops].sort((a, b) => a.position - b.position);

        sorted.forEach((stop) => {
            const idx = this._gradient.stops.indexOf(stop);
            const handle = document.createElement('div');
            handle.className = 'handle';
            handle.style.left = stop.position + '%';
            handle.style.backgroundColor = stop.color;
            handle.dataset.index = idx;

            // Hidden color input for this stop
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = stop.color;
            colorInput.className = 'color-input';
            handle.appendChild(colorInput);

            // Click to open color picker (only if not after a drag)
            handle.addEventListener('click', (e) => {
                if ( this._justDragged ) {
                    this._justDragged = false;
                    return;
                }
                e.stopPropagation();
                colorInput.click();
            });

            // Color change from picker — continuous
            colorInput.addEventListener('input', (e) => {
                const i = parseInt(handle.dataset.index, 10);
                this._gradient.stops[i].color = e.target.value;
                handle.style.backgroundColor = e.target.value;
                this._updatePreview();
                this._emitGradient('wox-gradient-input');
            });

            // Color change from picker — final
            colorInput.addEventListener('change', () => {
                this._emitGradient('wox-gradient-change');
            });

            // Prevent click on color input from bubbling to handle
            colorInput.addEventListener('click', (e) => e.stopPropagation());

            // Drag to reposition
            handle.addEventListener('mousedown', (e) => {
                if ( e.target === colorInput ) return;
                e.preventDefault();
                e.stopPropagation();

                const bar = this.$('.bar');
                if ( ! bar ) return;
                const barRect = bar.getBoundingClientRect();
                const i = parseInt(handle.dataset.index, 10);
                this._dragging = { idx: i, startY: e.clientY };
                handle.classList.add('dragging');

                const onMouseMove = (ev) => {
                    const pos = ((ev.clientX - barRect.left) / barRect.width) * 100;
                    const clamped = Math.max(0, Math.min(100, Math.round(pos * 10) / 10));
                    this._gradient.stops[i].position = clamped;
                    handle.style.left = clamped + '%';

                    // Vertical distance for removal indication
                    const dy = Math.abs(ev.clientY - this._dragging.startY);
                    if ( dy > REMOVE_THRESHOLD && this._gradient.stops.length > MIN_STOPS ) {
                        handle.classList.add('removing');
                    } else {
                        handle.classList.remove('removing');
                    }

                    this._updatePreview();
                    this._emitGradient('wox-gradient-input');
                };

                const onMouseUp = (ev) => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    handle.classList.remove('dragging');

                    const dy = Math.abs(ev.clientY - this._dragging.startY);

                    // Remove stop if dragged far enough vertically
                    if ( dy > REMOVE_THRESHOLD && this._gradient.stops.length > MIN_STOPS ) {
                        this._gradient.stops.splice(i, 1);
                        this._renderStops();
                        this._updatePreview();
                        this._emitGradient('wox-gradient-change');
                    } else {
                        // Emit change on mouseup (position finalized)
                        this._emitGradient('wox-gradient-change');
                    }

                    // If mouse moved more than threshold, mark as drag (don't open color picker)
                    const dx = Math.abs(ev.clientX - (barRect.left + (this._gradient.stops[i]?.position || 0) * barRect.width / 100));
                    if ( dy > DRAG_THRESHOLD || dx > DRAG_THRESHOLD ) {
                        this._justDragged = true;
                    }

                    this._dragging = null;
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            stopsContainer.appendChild(handle);
        });
    };

    /**
     * Binds the double-click event on the gradient bar to add new stops.
     * @private
     */
    _bindBarEvents = () => {
        const bar = this.$('.bar');
        if ( ! bar ) return;

        bar.addEventListener('dblclick', (e) => {
            const rect = bar.getBoundingClientRect();
            const pos = Math.round(((e.clientX - rect.left) / rect.width) * 100);
            const clamped = Math.max(0, Math.min(100, pos));

            // Interpolate color from neighboring stops
            const sorted = [...this._gradient.stops].sort((a, b) => a.position - b.position);
            let color = '#888888';
            for ( let i = 0; i < sorted.length - 1; i++ ) {
                if ( clamped >= sorted[i].position && clamped <= sorted[i + 1].position ) {
                    color = sorted[i].color;
                    break;
                }
            }

            this._gradient.stops.push({ color, position: clamped });
            this._renderStops();
            this._updatePreview();
            this._emitGradient('wox-gradient-change');
        });
    };
}

export { WoxGradientEditor };
