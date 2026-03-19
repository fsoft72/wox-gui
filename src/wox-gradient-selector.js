// wox-gradient-selector.js — Gradient/color selector with presets, editor dialog, and animation controls

import { WoxElement } from './wox-base.js';
import { gradientToCSS, cssToGradient } from './wox-gradient-editor.js';
import './wox-slider.js';
import './wox-modal.js';
import './wox-gradient-editor.js';

/** localStorage key for saved gradients */
const STORAGE_KEY = 'wox_gradients';

/** Prefix for preset gradient IDs (cannot be edited/deleted) */
const PRESET_PREFIX = 'grad_preset_';

/** Default preset gradients seeded on first use */
const DEFAULT_PRESETS = [
    { id: 'grad_preset_sunset', name: 'Sunset', type: 'linear', angle: 135, stops: [{ color: '#ff512f', position: 0 }, { color: '#f09819', position: 100 }] },
    { id: 'grad_preset_ocean', name: 'Ocean', type: 'linear', angle: 135, stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }] },
    { id: 'grad_preset_forest', name: 'Forest', type: 'linear', angle: 135, stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { id: 'grad_preset_purple_haze', name: 'Purple Haze', type: 'linear', angle: 135, stops: [{ color: '#7b4397', position: 0 }, { color: '#dc2430', position: 100 }] },
    { id: 'grad_preset_midnight', name: 'Midnight', type: 'linear', angle: 135, stops: [{ color: '#232526', position: 0 }, { color: '#414345', position: 100 }] },
    { id: 'grad_preset_peach', name: 'Peach', type: 'linear', angle: 135, stops: [{ color: '#ffecd2', position: 0 }, { color: '#fcb69f', position: 100 }] },
];

const STYLES = `
    :host { display: block; }
    .selector { position: relative; }
    .current {
        display: flex; align-items: center; gap: 8px;
        padding: 6px 8px; border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-sm, 3px); cursor: pointer;
        background: var(--wox-bg-input, #1a1a1d); transition: border-color var(--wox-transition-fast);
    }
    .current:hover { border-color: var(--wox-accent, #00e5ff); }
    .selector.open .current { border-color: var(--wox-accent, #00e5ff); }
    .preview { width: 32px; height: 20px; border-radius: 3px; border: 1px solid var(--wox-border, #333); flex-shrink: 0; }
    .label { flex: 1; font-size: var(--wox-font-size-lg, 13px); color: var(--wox-text-primary, #eee); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .chevron { font-size: 10px; color: var(--wox-text-secondary, #999); flex-shrink: 0; }
    .dropdown {
        display: none; position: fixed;
        z-index: var(--wox-z-dropdown, 1000); background: var(--wox-bg-panel, #17171a);
        border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-sm, 3px);
        box-shadow: var(--wox-shadow-md); max-height: 280px; overflow-y: auto;
    }
    .selector.open .dropdown { display: block; }
    .dropdown-item {
        display: flex; align-items: center; gap: 8px; padding: 8px 10px;
        cursor: pointer; transition: background var(--wox-transition-fast);
    }
    .dropdown-item:hover { background: var(--wox-bg-hover, #2a2a2e); }
    .dropdown-item-preview { width: 40px; height: 20px; border-radius: 3px; border: 1px solid var(--wox-border, #333); flex-shrink: 0; }
    .dropdown-item-label { flex: 1; font-size: var(--wox-font-size-lg, 13px); color: var(--wox-text-primary, #eee); }
    .dropdown-item-btn {
        display: none; background: none; border: none; color: var(--wox-text-secondary, #999);
        font-size: 14px; cursor: pointer; padding: 0 4px; line-height: 1; transition: color var(--wox-transition-fast);
    }
    .dropdown-item-btn.delete-btn { font-size: 16px; }
    .dropdown-item:hover .dropdown-item-btn { display: block; }
    .dropdown-item-btn:hover { color: var(--wox-accent, #00e5ff); }
    .dropdown-item-btn.delete-btn:hover { color: var(--wox-danger, #f72585); }
    .dropdown-custom { border-top: 1px solid var(--wox-border, #333); }
    .dropdown-custom .dropdown-item-label { color: var(--wox-accent, #00e5ff); font-weight: 500; }
    .solid-input { position: absolute; opacity: 0; pointer-events: none; }

    /* Controls */
    .controls { margin-top: 10px; display: none; }
    .controls.visible { display: block; }
    .ctrl-label { font-size: var(--wox-font-size-sm, 10px); color: var(--wox-text-secondary, #999); font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; min-width: 40px; }
    .type-row { display: flex; align-items: center; gap: 8px; margin-bottom: var(--wox-space-lg, 12px); }
    .type-toggle { display: flex; gap: var(--wox-space-sm, 4px); background: var(--wox-bg-input, #1a1a1d); padding: 3px; border-radius: var(--wox-radius-sm, 3px); }
    .type-btn {
        background: transparent; border: none; padding: 4px 14px; cursor: pointer;
        border-radius: 3px; font-size: var(--wox-font-size-base, 12px); font-weight: 500;
        color: var(--wox-text-secondary, #999); transition: all var(--wox-transition-fast);
        font-family: var(--wox-font, 'Inter', sans-serif);
    }
    .type-btn:hover { color: var(--wox-text-primary, #eee); background: var(--wox-bg-hover, #2a2a2e); }
    .type-btn.active { background: var(--wox-accent, #00e5ff); color: var(--wox-text-hi, #fff); }
    .angle-row, .speed-row { margin-bottom: var(--wox-space-lg, 12px); }
    .anim-type-row { display: flex; align-items: center; gap: 8px; margin-bottom: var(--wox-space-lg, 12px); }
    .anim-select {
        flex: 1; padding: 4px 8px; border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-sm, 3px); font-size: var(--wox-font-size-base, 12px);
        background: var(--wox-bg-input, #1a1a1d); color: var(--wox-text-primary, #eee); cursor: pointer;
        font-family: var(--wox-font, 'Inter', sans-serif);
    }

    /* Modal body */
    .editor-body { min-width: 400px; }
    .name-row { display: flex; align-items: center; gap: 8px; margin-top: var(--wox-space-xl, 16px); }
    .name-input {
        flex: 1; padding: 6px 8px; border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-sm, 3px); font-size: var(--wox-font-size-base, 12px);
        background: var(--wox-bg-input, #1a1a1d); color: var(--wox-text-primary, #eee);
        font-family: var(--wox-font, 'Inter', sans-serif);
    }
    .name-input:focus { outline: none; border-color: var(--wox-accent, #00e5ff); }

    /* Footer buttons */
    .btn {
        padding: 8px 16px; border-radius: var(--wox-radius-md, 6px);
        font-family: var(--wox-font, sans-serif); font-size: var(--wox-font-size-lg, 13px);
        font-weight: 500; cursor: pointer; border: none; transition: background var(--wox-transition-fast);
    }
    .btn-secondary { background: var(--wox-border, #333); color: var(--wox-text-primary, #eee); }
    .btn-secondary:hover { background: var(--wox-border-light, #444); }
    .btn-primary { background: var(--wox-accent, #00e5ff); color: var(--wox-text-hi, #fff); }
    .btn-primary:hover { filter: brightness(0.85); }
`;

/**
 * Generate a unique gradient ID.
 * @returns {string}
 */
const _generateId = () => 'grad_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

/**
 * Check if a CSS value represents a gradient (vs solid color).
 * @param {string} value
 * @returns {boolean}
 */
const _isGradient = (value) => {
    if ( ! value ) return false;
    return value.startsWith('linear-gradient') || value.startsWith('radial-gradient');
};

/**
 * <wox-gradient-selector> — Gradient/color selector with presets, custom editor,
 * animation controls, and localStorage persistence.
 *
 * @attr {string} value           - CSS value: hex color or gradient string
 * @attr {number} animation-speed - Animation speed 0-10 (default 0)
 * @attr {string} animation-type  - Animation type: 'pingpong' or 'cycle' (default 'pingpong')
 *
 * @fires wox-gradient-change - { value, animationSpeed, animationType }
 */
class WoxGradientSelector extends WoxElement {
    static observedAttributes = ['value', 'animation-speed', 'animation-type'];

    /** @private — Current CSS value (hex or gradient string) */
    _value = '#ffffff';
    /** @private — Parsed gradient object or null for solid colors */
    _gradient = null;
    /** @private — Animation speed 0-10 */
    _animationSpeed = 0;
    /** @private — Animation type: 'pingpong' or 'cycle' */
    _animationType = 'pingpong';
    /** @private — Whether the dropdown is currently open */
    _open = false;
    /** @private — Saved gradients array */
    _gradients = [];
    /** @private — Gradient currently being edited in the modal */
    _editingGradient = null;
    /** @private — Name captured from the modal name input */
    _editingName = '';

    connectedCallback() {
        this._loadGradients();
        this._syncFromAttributes();
        this._build();
        this._outsideClickHandler = (e) => {
            if ( ! this._open ) return;
            if ( this.contains(e.target) ) return;
            // Also check shadow DOM
            const path = e.composedPath();
            if ( path.includes(this) ) return;
            this._closeDropdown();
        };
        document.addEventListener('click', this._outsideClickHandler);
    }

    disconnectedCallback() {
        if ( this._outsideClickHandler ) {
            document.removeEventListener('click', this._outsideClickHandler);
        }
    }

    attributeChangedCallback(name) {
        if ( ! this.isConnected ) return;
        this._syncFromAttributes();
        this._updatePreview();
        this._syncControls();
    }

    /**
     * Read attributes and update internal state.
     * @private
     */
    _syncFromAttributes = () => {
        const val = this.getAttribute('value');
        if ( val ) {
            this._value = val;
            this._gradient = _isGradient(val) ? cssToGradient(val) : null;
        }
        const speed = this.getAttribute('animation-speed');
        if ( speed !== null ) this._animationSpeed = parseInt(speed, 10) || 0;
        const type = this.getAttribute('animation-type');
        if ( type ) this._animationType = type;
    };

    /**
     * Load gradients from localStorage, or seed with defaults.
     * @private
     */
    _loadGradients = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if ( raw ) {
                this._gradients = JSON.parse(raw);
                return;
            }
        } catch ( e ) {
            // Ignore parse errors
        }
        // Seed defaults
        this._gradients = DEFAULT_PRESETS.map(p => ({ ...p, stops: p.stops.map(s => ({ ...s })) }));
        this._persistGradients();
    };

    /**
     * Persist gradients array to localStorage.
     * @private
     */
    _persistGradients = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._gradients));
        } catch ( e ) {
            // Ignore quota errors
        }
    };

    /**
     * Upsert a gradient (update if id exists, insert otherwise) and persist.
     * @private
     * @param {Object} gradient - Gradient object with id, name, type, angle, stops
     */
    _save = (gradient) => {
        const idx = this._gradients.findIndex(g => g.id === gradient.id);
        if ( idx >= 0 ) {
            this._gradients[idx] = gradient;
        } else {
            this._gradients.push(gradient);
        }
        this._persistGradients();
    };

    /**
     * Delete a gradient by ID and persist.
     * @private
     * @param {string} id - Gradient ID to remove
     */
    _delete = (id) => {
        this._gradients = this._gradients.filter(g => g.id !== id);
        this._persistGradients();
    };

    /**
     * Find a gradient by its ID.
     * @private
     * @param {string} id
     * @returns {Object|undefined}
     */
    _getById = (id) => this._gradients.find(g => g.id === id);

    /**
     * Derive a human-readable label from a CSS value.
     * @private
     * @param {string} value
     * @returns {string}
     */
    _labelForValue = (value) => {
        if ( ! value ) return 'None';
        if ( _isGradient(value) ) {
            for ( const g of this._gradients ) {
                if ( gradientToCSS(g) === value ) return g.name;
            }
            return 'Custom Gradient';
        }
        return value;
    };

    /**
     * Build the full shadow DOM and bind events.
     * @private
     */
    _build = () => {
        const isGrad = !!this._gradient;
        const gType = this._gradient ? this._gradient.type : 'linear';
        const gAngle = this._gradient ? this._gradient.angle : 90;
        const isLinear = gType !== 'radial';

        this.render(STYLES, `
            <div class="selector">
                <div class="current">
                    <div class="preview"></div>
                    <span class="label">${this._labelForValue(this._value)}</span>
                    <span class="chevron">&#9662;</span>
                </div>
                <div class="dropdown"></div>
            </div>
            <div class="controls${isGrad ? ' visible' : ''}">
                <div class="type-row">
                    <span class="ctrl-label">Type</span>
                    <div class="type-toggle">
                        <button class="type-btn${isLinear ? ' active' : ''}" data-type="linear">Linear</button>
                        <button class="type-btn${!isLinear ? ' active' : ''}" data-type="radial">Radial</button>
                    </div>
                </div>
                <div class="angle-row" ${!isLinear ? 'style="display:none"' : ''}>
                    <wox-slider label="ANGLE" value="${gAngle}" min="0" max="360" step="1" show-value></wox-slider>
                </div>
                <div class="speed-row">
                    <wox-slider label="SPEED" value="${this._animationSpeed}" min="0" max="10" step="1" show-value></wox-slider>
                </div>
                <div class="anim-type-row" ${this._animationSpeed <= 0 ? 'style="display:none"' : ''}>
                    <span class="ctrl-label">Anim</span>
                    <select class="anim-select">
                        <option value="pingpong"${this._animationType === 'pingpong' ? ' selected' : ''}>Ping Pong</option>
                        <option value="cycle"${this._animationType === 'cycle' ? ' selected' : ''}>Cycle</option>
                    </select>
                </div>
            </div>
            <wox-modal class="editor-modal" title="Custom Gradient" width="480px">
                <div class="editor-body">
                    <wox-gradient-editor class="modal-editor"></wox-gradient-editor>
                    <div class="name-row">
                        <span class="ctrl-label">Name</span>
                        <input type="text" class="name-input" placeholder="Gradient name">
                    </div>
                </div>
                <div slot="footer">
                    <button class="btn btn-secondary cancel-btn">Cancel</button>
                    <button class="btn btn-primary apply-btn">Apply</button>
                    <button class="btn btn-primary save-btn">Save &amp; Apply</button>
                </div>
            </wox-modal>
        `);

        this._updatePreview();
        this._bindEvents();
    };

    /**
     * Update the preview swatch and label text.
     * @private
     */
    _updatePreview = () => {
        const preview = this.$('.preview');
        const label = this.$('.label');
        if ( preview ) preview.style.background = this._value;
        if ( label ) label.textContent = this._labelForValue(this._value);
    };

    /**
     * Sync all controls (type toggle, angle, speed, anim type) to current state.
     * @private
     */
    _syncControls = () => {
        const controls = this.$('.controls');
        if ( ! controls ) return;

        if ( ! this._gradient ) {
            controls.classList.remove('visible');
            return;
        }

        controls.classList.add('visible');
        const isLinear = this._gradient.type !== 'radial';

        // Type toggle
        this.$$('.type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === this._gradient.type);
        });

        // Angle row visibility
        const angleRow = this.$('.angle-row');
        if ( angleRow ) angleRow.style.display = isLinear ? '' : 'none';

        // Angle slider value
        const angleSlider = this.$('.angle-row wox-slider');
        if ( angleSlider ) angleSlider.setAttribute('value', this._gradient.angle);

        // Speed slider value
        const speedSlider = this.$('.speed-row wox-slider');
        if ( speedSlider ) speedSlider.setAttribute('value', this._animationSpeed);

        // Anim type row
        const animRow = this.$('.anim-type-row');
        if ( animRow ) animRow.style.display = this._animationSpeed > 0 ? '' : 'none';

        // Anim select
        const animSelect = this.$('.anim-select');
        if ( animSelect ) animSelect.value = this._animationType;
    };

    /**
     * Bind all interactive event listeners.
     * @private
     */
    _bindEvents = () => {
        // Toggle dropdown
        const current = this.$('.current');
        current.addEventListener('click', (e) => {
            e.stopPropagation();
            if ( this._open ) {
                this._closeDropdown();
            } else {
                this._openDropdown();
            }
        });

        // Type toggle buttons
        this.$$('.type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if ( ! this._gradient ) return;
                this.$$('.type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._gradient.type = btn.dataset.type;
                const angleRow = this.$('.angle-row');
                if ( angleRow ) angleRow.style.display = btn.dataset.type === 'linear' ? '' : 'none';
                this._applyGradient();
            });
        });

        // Angle slider
        const angleSlider = this.$('.angle-row wox-slider');
        if ( angleSlider ) {
            angleSlider.addEventListener('wox-input', (e) => {
                if ( ! this._gradient ) return;
                this._gradient.angle = e.detail.value;
                this._applyGradient();
            });
            angleSlider.addEventListener('wox-change', (e) => {
                if ( ! this._gradient ) return;
                this._gradient.angle = e.detail.value;
                this._applyGradient();
            });
        }

        // Speed slider
        const speedSlider = this.$('.speed-row wox-slider');
        if ( speedSlider ) {
            speedSlider.addEventListener('wox-input', (e) => {
                this._animationSpeed = e.detail.value;
                const animRow = this.$('.anim-type-row');
                if ( animRow ) animRow.style.display = this._animationSpeed > 0 ? '' : 'none';
                this._emitChange();
            });
            speedSlider.addEventListener('wox-change', (e) => {
                this._animationSpeed = e.detail.value;
                const animRow = this.$('.anim-type-row');
                if ( animRow ) animRow.style.display = this._animationSpeed > 0 ? '' : 'none';
                this._emitChange();
            });
        }

        // Animation type select
        const animSelect = this.$('.anim-select');
        if ( animSelect ) {
            animSelect.addEventListener('change', (e) => {
                this._animationType = e.target.value;
                this._emitChange();
            });
        }

        // Modal buttons
        const cancelBtn = this.$('.cancel-btn');
        if ( cancelBtn ) {
            cancelBtn.addEventListener('click', () => {
                this._closeModal();
            });
        }

        const applyBtn = this.$('.apply-btn');
        if ( applyBtn ) {
            applyBtn.addEventListener('click', () => {
                this._applyFromEditor(false);
            });
        }

        const saveBtn = this.$('.save-btn');
        if ( saveBtn ) {
            saveBtn.addEventListener('click', () => {
                this._applyFromEditor(true);
            });
        }

        // Name input — capture on every keystroke
        const nameInput = this.$('.name-input');
        if ( nameInput ) {
            nameInput.addEventListener('input', (e) => {
                this._editingName = e.target.value.trim();
            });
        }

        // Gradient editor changes — update editing gradient
        const editor = this.$('.modal-editor');
        if ( editor ) {
            editor.addEventListener('wox-gradient-input', (e) => {
                this._editingGradient = e.detail.gradient;
            });
            editor.addEventListener('wox-gradient-change', (e) => {
                this._editingGradient = e.detail.gradient;
            });
        }

        // Modal close via wox-close (backdrop click, escape, X button)
        const modal = this.$('.editor-modal');
        if ( modal ) {
            modal.addEventListener('wox-close', () => {
                this._editingGradient = null;
                this._editingName = '';
            });
        }
    };

    /**
     * Open the dropdown and populate its items.
     * @private
     */
    _openDropdown = () => {
        this._open = true;
        this.$('.selector').classList.add('open');
        this._populateDropdown();
        this._positionDropdown();
    };

    /**
     * Position the fixed dropdown relative to the trigger, flipping up if needed.
     * @private
     */
    _positionDropdown = () => {
        const current = this.$('.current');
        const dropdown = this.$('.dropdown');
        if ( ! current || ! dropdown ) return;

        const rect = current.getBoundingClientRect();
        const vh = window.innerHeight;

        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${rect.width}px`;

        // Try below first
        const spaceBelow = vh - rect.bottom;
        const spaceAbove = rect.top;
        const maxH = 280;

        if ( spaceBelow >= maxH || spaceBelow >= spaceAbove ) {
            // Place below
            dropdown.style.top = `${rect.bottom}px`;
            dropdown.style.bottom = '';
            dropdown.style.maxHeight = `${Math.min(maxH, spaceBelow - 4)}px`;
        } else {
            // Place above
            dropdown.style.top = '';
            dropdown.style.bottom = `${vh - rect.top}px`;
            dropdown.style.maxHeight = `${Math.min(maxH, spaceAbove - 4)}px`;
        }
    };

    /**
     * Close the dropdown.
     * @private
     */
    _closeDropdown = () => {
        this._open = false;
        this.$('.selector').classList.remove('open');
    };

    /**
     * Build dropdown items: solid color, saved gradients, custom option.
     * @private
     */
    _populateDropdown = () => {
        const dropdown = this.$('.dropdown');
        if ( ! dropdown ) return;

        let html = '';

        // Solid color option
        const solidVal = this._value.startsWith('#') ? this._value : '#ffffff';
        html += `
            <div class="dropdown-item" data-action="solid">
                <div class="dropdown-item-preview" style="background: #ffffff"></div>
                <span class="dropdown-item-label">Solid Color</span>
                <input type="color" class="solid-input" value="${solidVal}">
            </div>
        `;

        // Saved gradients
        this._gradients.forEach(g => {
            const css = gradientToCSS(g);
            const isPreset = g.id.startsWith(PRESET_PREFIX);
            const dupBtn = isPreset
                ? `<button class="dropdown-item-btn" data-dup-id="${g.id}" title="Duplicate gradient">&#x2398;</button>`
                : '';
            const editBtn = isPreset
                ? ''
                : `<button class="dropdown-item-btn" data-edit-id="${g.id}" title="Edit gradient">&#9998;</button>`;
            const deleteBtn = isPreset
                ? ''
                : `<button class="dropdown-item-btn delete-btn" data-delete-id="${g.id}" title="Delete gradient">&times;</button>`;
            html += `
                <div class="dropdown-item" data-gradient-id="${g.id}">
                    <div class="dropdown-item-preview" style="background: ${css}"></div>
                    <span class="dropdown-item-label">${g.name}</span>
                    ${dupBtn}
                    ${editBtn}
                    ${deleteBtn}
                </div>
            `;
        });

        // Custom gradient option
        html += `
            <div class="dropdown-item dropdown-custom" data-action="custom">
                <span class="dropdown-item-label">Custom Gradient...</span>
            </div>
        `;

        dropdown.innerHTML = html;
        this._bindDropdown();
    };

    /**
     * Bind event listeners for dropdown items.
     * @private
     */
    _bindDropdown = () => {
        const dropdown = this.$('.dropdown');
        if ( ! dropdown ) return;

        // Solid color
        const solidItem = dropdown.querySelector('[data-action="solid"]');
        const solidInput = dropdown.querySelector('.solid-input');
        if ( solidItem && solidInput ) {
            solidItem.addEventListener('click', (e) => {
                e.stopPropagation();
                solidInput.style.pointerEvents = 'auto';
                solidInput.click();
            });
            solidInput.addEventListener('input', (e) => {
                this._value = e.target.value;
                this._gradient = null;
                this._animationSpeed = 0;
                this._updatePreview();
                this._syncControls();
                this._emitChange();
            });
            solidInput.addEventListener('change', () => {
                solidInput.style.pointerEvents = 'none';
            });
            solidInput.addEventListener('click', (e) => e.stopPropagation());
        }

        // Gradient items
        dropdown.querySelectorAll('[data-gradient-id]').forEach(item => {
            item.addEventListener('click', (e) => {
                if ( e.target.hasAttribute('data-delete-id') ) return;
                if ( e.target.hasAttribute('data-edit-id') ) return;
                if ( e.target.hasAttribute('data-dup-id') ) return;
                const gradient = this._getById(item.dataset.gradientId);
                if ( ! gradient ) return;
                this._gradient = JSON.parse(JSON.stringify(gradient));
                this._value = gradientToCSS(this._gradient);
                this._updatePreview();
                this._syncControls();
                this._emitChange();
                this._closeDropdown();
            });
        });

        // Duplicate buttons
        dropdown.querySelectorAll('[data-dup-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const source = this._getById(btn.dataset.dupId);
                if ( ! source ) return;
                const copy = {
                    id: _generateId(),
                    name: source.name + ' Copy',
                    type: source.type,
                    angle: source.angle,
                    stops: source.stops.map(s => ({ ...s }))
                };
                this._closeDropdown();
                this._openEditorDialog(copy);
            });
        });

        // Edit buttons
        dropdown.querySelectorAll('[data-edit-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gradient = this._getById(btn.dataset.editId);
                if ( ! gradient ) return;
                this._closeDropdown();
                this._openEditorDialog(JSON.parse(JSON.stringify(gradient)));
            });
        });

        // Delete buttons
        dropdown.querySelectorAll('[data-delete-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._delete(btn.dataset.deleteId);
                this._populateDropdown();
            });
        });

        // Custom gradient
        const customItem = dropdown.querySelector('[data-action="custom"]');
        if ( customItem ) {
            customItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this._closeDropdown();
                this._openEditorDialog();
            });
        }
    };

    /**
     * Open the editor modal with a gradient to edit.
     * @private
     * @param {Object} [existingGradient] - Gradient to edit; omit to create new
     */
    _openEditorDialog = (existingGradient) => {
        let gradient;
        if ( existingGradient ) {
            gradient = JSON.parse(JSON.stringify(existingGradient));
        } else {
            gradient = cssToGradient(this._value);
            if ( ! gradient ) {
                gradient = {
                    id: _generateId(),
                    name: 'Custom Gradient',
                    type: 'linear',
                    angle: 90,
                    stops: [
                        { color: this._value.startsWith('#') ? this._value : '#000000', position: 0 },
                        { color: '#ffffff', position: 100 }
                    ]
                };
            } else {
                gradient.id = gradient.id || _generateId();
                gradient.name = gradient.name || 'Custom Gradient';
            }
        }

        this._editingGradient = JSON.parse(JSON.stringify(gradient));
        this._editingName = gradient.name;

        // Set the gradient editor data
        const editor = this.$('.modal-editor');
        if ( editor ) editor.gradient = this._editingGradient;

        // Set the name input
        const nameInput = this.$('.name-input');
        if ( nameInput ) nameInput.value = gradient.name;

        // Store the original ID for save operations
        this._editingOriginalId = gradient.id;

        // Open modal
        const modal = this.$('.editor-modal');
        if ( modal ) modal.setAttribute('open', '');
    };

    /**
     * Apply the edited gradient from the modal.
     * @private
     * @param {boolean} save - Whether to persist to localStorage
     */
    _applyFromEditor = (save) => {
        if ( ! this._editingGradient ) return;

        const gradient = JSON.parse(JSON.stringify(this._editingGradient));
        if ( this._editingName ) gradient.name = this._editingName;
        gradient.id = this._editingOriginalId || gradient.id || _generateId();

        if ( save ) {
            this._save(gradient);
        }

        this._gradient = JSON.parse(JSON.stringify(gradient));
        this._value = gradientToCSS(this._gradient);
        this._updatePreview();
        this._syncControls();
        this._emitChange();
        this._closeModal();
    };

    /**
     * Close the editor modal.
     * @private
     */
    _closeModal = () => {
        const modal = this.$('.editor-modal');
        if ( modal ) modal.removeAttribute('open');
        this._editingGradient = null;
        this._editingName = '';
        this._editingOriginalId = null;
    };

    /**
     * Recompute CSS from the current gradient object and emit change.
     * @private
     */
    _applyGradient = () => {
        if ( ! this._gradient ) return;
        this._value = gradientToCSS(this._gradient);
        this._updatePreview();
        this._emitChange();
    };

    /**
     * Emit the wox-gradient-change event with current state.
     * @private
     */
    _emitChange = () => {
        this.emit('wox-gradient-change', {
            value: this._value,
            animationSpeed: this._animationSpeed,
            animationType: this._animationType
        });
    };
}

export { WoxGradientSelector };
