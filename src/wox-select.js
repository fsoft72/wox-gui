// wox-select.js — Searchable, multi-select dropdown with keyboard navigation
// Ported from SmartSelectElement (liwe3-webcomponents/packages/core/src/SmartSelect.ts)

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host {
        display: inline-block;
        position: relative;
        min-width: 200px;
        font-family: var(--wox-font, 'Inter', sans-serif);
        font-size: var(--wox-font-size-base, 12px);
        outline: none;
    }

    :host(:focus) .trigger,
    :host(:focus-within) .trigger {
        border-color: var(--wox-accent, #00e5ff);
        box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.1);
    }

    :host([disabled]) {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
    }

    .trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        background: var(--wox-bg-input, #1a1a1d);
        border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-md, 6px);
        padding: 6px 8px;
        cursor: pointer;
        min-height: 30px;
        box-sizing: border-box;
        color: var(--wox-text-primary, #eee);
        user-select: none;
        transition: border-color var(--wox-transition-fast, 0.12s);
    }

    .trigger:focus { outline: none; }

    .selected-content {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
        flex: 1;
        min-width: 0;
    }

    .placeholder {
        color: var(--wox-text-secondary, #999);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .single-value {
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .single-img {
        width: 18px;
        height: 18px;
        border-radius: var(--wox-radius-round, 50%);
        object-fit: cover;
        flex-shrink: 0;
    }

    .tag {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 1px 6px;
        background: var(--wox-bg-hover, #2a2a2e);
        border: 1px solid var(--wox-border-light, #444);
        border-radius: var(--wox-radius-sm, 3px);
        font-size: var(--wox-font-size-sm, 10px);
        color: var(--wox-text-primary, #eee);
        user-select: none;
    }

    .tag-img {
        width: 14px;
        height: 14px;
        border-radius: var(--wox-radius-round, 50%);
        object-fit: cover;
        flex-shrink: 0;
    }

    .remove-tag {
        cursor: pointer;
        color: var(--wox-text-secondary, #999);
        font-size: 12px;
        line-height: 1;
        padding: 0 1px;
    }

    .remove-tag:hover { color: var(--wox-danger, #f72585); }

    .arrow {
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--wox-text-secondary, #999);
        flex-shrink: 0;
        transition: transform var(--wox-transition-fast, 0.12s);
    }

    .arrow.open { transform: rotate(180deg); }

    .dropdown {
        position: absolute;
        left: 0;
        width: 100%;
        z-index: var(--wox-z-dropdown, 1000);
        background: var(--wox-bg-panel, #17171a);
        border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-md, 6px);
        box-shadow: var(--wox-shadow-md, 0 4px 16px rgba(0, 0, 0, 0.4));
        max-height: 200px;
        overflow-y: auto;
        scroll-behavior: smooth;
        scrollbar-width: thin;
        scrollbar-color: var(--wox-border-light, #444) transparent;
    }

    .dropdown::-webkit-scrollbar { width: 4px; }
    .dropdown::-webkit-scrollbar-track { background: transparent; }
    .dropdown::-webkit-scrollbar-thumb {
        background: var(--wox-border-light, #444);
        border-radius: 2px;
    }
    .dropdown::-webkit-scrollbar-thumb:hover {
        background: var(--wox-text-secondary, #999);
    }

    .search-input {
        width: 100%;
        padding: 6px 10px;
        background: var(--wox-bg-input, #1a1a1d);
        border: none;
        border-bottom: 1px solid var(--wox-border, #333);
        color: var(--wox-text-primary, #eee);
        font-size: var(--wox-font-size-base, 12px);
        font-family: var(--wox-font, sans-serif);
        outline: none;
        box-sizing: border-box;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        cursor: pointer;
        color: var(--wox-text-primary, #eee);
        font-size: var(--wox-font-size-base, 12px);
        transition: background var(--wox-transition-fast, 0.12s);
        user-select: none;
    }

    .option:hover { background: var(--wox-bg-hover, #2a2a2e); }

    .option.focused {
        background: rgba(0, 229, 255, 0.1);
        color: var(--wox-accent, #00e5ff);
    }

    .option.selected { color: var(--wox-accent, #00e5ff); }

    .option-img {
        width: 20px;
        height: 20px;
        border-radius: var(--wox-radius-round, 50%);
        object-fit: cover;
        flex-shrink: 0;
    }

    .no-options {
        padding: 8px 10px;
        color: var(--wox-text-secondary, #999);
        font-style: italic;
        font-size: var(--wox-font-size-base, 12px);
    }
`;

/** @param {string} str @returns {string} */
const _esc = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * <wox-select> — Searchable, multi-select dropdown with keyboard navigation.
 * Ported from SmartSelectElement (liwe3-webcomponents).
 *
 * @attr {boolean} multiple    - Enables multi-select with tag chips
 * @attr {boolean} searchable  - Shows a search input inside the dropdown
 * @attr {string}  placeholder - Placeholder text when nothing is selected
 * @attr {boolean} disabled    - Disables the component
 * @attr {string}  value       - Selected value (or JSON array for multiple)
 * @attr {string}  options     - JSON array of { value, label, image? } objects
 *
 * @fires wox-change - On selection change, detail: { value }
 * @fires wox-open   - When dropdown opens
 * @fires wox-close  - When dropdown closes
 * @fires wox-search - On search input change, detail: { query }
 */
class WoxSelect extends WoxElement {
    static observedAttributes = ['multiple', 'searchable', 'placeholder', 'disabled', 'value', 'options'];

    /** @type {boolean} */
    _isOpen = false;
    /** @type {boolean} */
    _openUpward = false;
    /** @type {Array<{value:string,label:string,image?:string}>} */
    _selectedOptions = [];
    /** @type {Array<{value:string,label:string,image?:string}>} */
    _filteredOptions = [];
    /** @type {number} */
    _focusedIndex = -1;
    /** @type {string} */
    _searchValue = '';
    /** @type {boolean} */
    _keyboardNavigating = false;
    /** @type {number|undefined} */
    _keyboardTimer;
    /** @type {Array<{value:string,label:string,image?:string}>|null} */
    _parsedOptions = null;

    connectedCallback() {
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');

        this._boundDocumentClick = (e) => {
            if (!this.contains(e.target)) this.close();
        };
        this._boundWindowResize = () => {
            if (this._isOpen) this._updateDropdownPosition();
        };
        this._boundWindowScroll = () => {
            if (this._isOpen) this._updateDropdownPosition();
        };

        this._boundShadowClick = (e) => {
            e.stopPropagation();
            const removeBtn = e.target.closest('.remove-tag');
            if (removeBtn) { this.deselectOption(removeBtn.dataset.value); return; }
            const option = e.target.closest('.option');
            if (option) { this.selectOption(option.dataset.value); return; }
            if (e.target.closest('.trigger')) this.toggle();
        };
        this._boundShadowMouseover = (e) => {
            if (this._keyboardNavigating) return;
            const option = e.target.closest('.option');
            if (!option) return;
            const opts = Array.from(this.$$('.option'));
            const idx = opts.indexOf(option);
            if (this._focusedIndex !== idx) {
                this.$('.option.focused')?.classList.remove('focused');
                option.classList.add('focused');
                this._focusedIndex = idx;
            }
        };
        this._boundShadowInput = (e) => {
            if (e.target.classList.contains('search-input')) {
                this._handleSearch(e.target.value);
            }
        };

        document.addEventListener('click', this._boundDocumentClick);
        window.addEventListener('resize', this._boundWindowResize);
        window.addEventListener('scroll', this._boundWindowScroll, true);
        this.addEventListener('keydown', this._handleKeydown);
        this.shadowRoot.addEventListener('click', this._boundShadowClick);
        this.shadowRoot.addEventListener('mouseover', this._boundShadowMouseover);
        this.shadowRoot.addEventListener('input', this._boundShadowInput);

        this._render();
    }

    disconnectedCallback() {
        clearTimeout(this._keyboardTimer);
        document.removeEventListener('click', this._boundDocumentClick);
        window.removeEventListener('resize', this._boundWindowResize);
        window.removeEventListener('scroll', this._boundWindowScroll, true);
        this.removeEventListener('keydown', this._handleKeydown);
        this.shadowRoot.removeEventListener('click', this._boundShadowClick);
        this.shadowRoot.removeEventListener('mouseover', this._boundShadowMouseover);
        this.shadowRoot.removeEventListener('input', this._boundShadowInput);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue || !this.isConnected) return;
        if (name === 'options') {
            this._parsedOptions = null;
            const newOpts = this.options;
            this._filteredOptions = [...newOpts];
            this._selectedOptions = this._selectedOptions.filter((s) =>
                newOpts.some((o) => o.value === s.value)
            );
        } else if (name === 'value' && newValue !== null) {
            // Handles single-select only; multi-select must be set via the JS property setter.
            const opt = this.options.find((o) => o.value === newValue);
            this._selectedOptions = opt ? [opt] : [];
        }
        this._render();
    }

    // ── Getters / setters ──────────────────────────────────────────────────────

    get multiple() { return this.hasAttribute('multiple'); }
    set multiple(v) { v ? this.setAttribute('multiple', '') : this.removeAttribute('multiple'); }

    get searchable() { return this.hasAttribute('searchable'); }
    set searchable(v) { v ? this.setAttribute('searchable', '') : this.removeAttribute('searchable'); }

    get placeholder() { return this.getAttribute('placeholder') || 'Select an option'; }
    set placeholder(v) { this.setAttribute('placeholder', v); }

    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

    get value() {
        if (this.multiple) return this._selectedOptions.map((o) => o.value);
        return this._selectedOptions.length > 0 ? this._selectedOptions[0].value : '';
    }

    set value(val) {
        if (this.multiple && Array.isArray(val)) {
            this._selectedOptions = this.options.filter((o) => val.includes(o.value));
        } else {
            const opt = this.options.find((o) => o.value === val);
            this._selectedOptions = opt ? [opt] : [];
        }
        this._render();
    }

    get options() {
        if (this._parsedOptions !== null) return this._parsedOptions;
        const attr = this.getAttribute('options');
        if (attr) {
            try {
                this._parsedOptions = JSON.parse(attr);
                return this._parsedOptions;
            } catch (e) {
                console.error('wox-select: invalid options JSON', e);
                return [];
            }
        }
        return [];
    }

    set options(opts) {
        this._parsedOptions = null;
        this.setAttribute('options', JSON.stringify(opts));
    }

    // ── Public API ─────────────────────────────────────────────────────────────

    /** Opens the dropdown */
    open() {
        if (this.disabled) return;
        this._isOpen = true;
        this._focusedIndex = -1;
        this._filteredOptions = [...this.options];

        const trigger = this.$('.trigger');
        if (trigger) {
            const rect = trigger.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            this._openUpward = spaceBelow < 210 && spaceAbove > spaceBelow;
        }

        this._render();
        this._updateDropdownPosition();

        if (this.searchable) {
            requestAnimationFrame(() => {
                const input = this.$('.search-input');
                if (input) input.focus();
            });
        }

        this.dispatchEvent(new CustomEvent('wox-open', { detail: null }));
    }

    /** Closes the dropdown */
    close() {
        this._isOpen = false;
        this._openUpward = false;
        this._focusedIndex = -1;
        this._searchValue = '';
        this._filteredOptions = [...this.options];

        const dropdown = this.$('.dropdown');
        if (dropdown) {
            dropdown.style.top = '';
            dropdown.style.bottom = '';
            dropdown.style.maxHeight = '';
        }

        this._render();
        this.dispatchEvent(new CustomEvent('wox-close', { detail: null }));
    }

    /** Toggles the dropdown open/closed */
    toggle() {
        this._isOpen ? this.close() : this.open();
    }

    /**
     * Selects an option by value
     * @param {string} value
     */
    selectOption(value) {
        const opt = this.options.find((o) => o.value === value);
        if (!opt) return;

        if (this.multiple) {
            if (!this._selectedOptions.find((o) => o.value === value)) {
                this._selectedOptions.push(opt);
            }
            this._render();
        } else {
            this._selectedOptions = [opt];
            this.close(); // close() calls _render() internally
        }

        this.emit('wox-change', { value: this.value });
    }

    /**
     * Deselects an option by value
     * @param {string} value
     */
    deselectOption(value) {
        this._selectedOptions = this._selectedOptions.filter((o) => o.value !== value);
        this._render();
        this.emit('wox-change', { value: this.value });
    }

    /**
     * Returns a copy of the currently selected options
     * @returns {Array<{value:string,label:string,image?:string}>}
     */
    getSelectedOptions() {
        return [...this._selectedOptions];
    }

    /**
     * Replaces all options and clears the selection
     * @param {Array<{value:string,label:string,image?:string}>} opts
     */
    setOptions(opts) {
        this._selectedOptions = [];
        this._filteredOptions = [...opts];
        this._parsedOptions = null;
        this.setAttribute('options', JSON.stringify(opts));
        // attributeChangedCallback will call _render()
    }

    // ── Private ────────────────────────────────────────────────────────────────

    /** @private */
    _handleSearch = (query) => {
        this._searchValue = query;
        this._filteredOptions = this.options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase())
        );
        this._focusedIndex = -1;
        this._render();
        this.emit('wox-search', { query });
    };

    /** @private */
    _updateFocusedOption = () => {
        const opts = this.$$('.option');
        opts.forEach((o) => o.classList.remove('focused'));
        if (this._focusedIndex >= 0 && this._focusedIndex < opts.length) {
            opts[this._focusedIndex].classList.add('focused');
        }
        this._scrollToFocused();
    };

    /** @private */
    _scrollToFocused = () => {
        if (this._focusedIndex < 0) return;
        requestAnimationFrame(() => {
            const dropdown = this.$('.dropdown');
            const focused = this.$('.option.focused');
            if (!dropdown || !focused) return;
            const dr = dropdown.getBoundingClientRect();
            const fr = focused.getBoundingClientRect();
            if (fr.top < dr.top) dropdown.scrollTop -= dr.top - fr.top;
            else if (fr.bottom > dr.bottom) dropdown.scrollTop += fr.bottom - dr.bottom;
        });
    };

    /** @private */
    _updateDropdownPosition = () => {
        requestAnimationFrame(() => {
            const dropdown = this.$('.dropdown');
            const trigger = this.$('.trigger');
            if (!dropdown || !trigger) return;

            const triggerRect = trigger.getBoundingClientRect();
            const triggerH = trigger.offsetHeight;
            const margin = 2;
            const maxH = 200;
            const pad = 10;

            const spaceBelow = window.innerHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;

            dropdown.style.top = '';
            dropdown.style.bottom = '';

            if (this._openUpward) {
                dropdown.style.bottom = `${triggerH + margin}px`;
                dropdown.style.maxHeight = `${Math.max(100, Math.min(maxH, spaceAbove - pad))}px`;
            } else {
                dropdown.style.top = `${triggerH + margin}px`;
                dropdown.style.maxHeight = `${Math.max(100, Math.min(maxH, spaceBelow - pad))}px`;
            }
        });
    };

    /** @private */
    _handleKeydown = (e) => {
        if (this.disabled) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this._keyboardNavigating = true;
                clearTimeout(this._keyboardTimer);
                this._keyboardTimer = window.setTimeout(() => { this._keyboardNavigating = false; }, 100);
                if (!this._isOpen) {
                    this.open();
                } else {
                    const search = this.$('.search-input');
                    if (this.searchable && search === this.shadowRoot.activeElement) {
                        this._focusedIndex = 0;
                        search.blur();
                        this.focus();
                        this._updateFocusedOption();
                        return;
                    }
                    this._focusedIndex = Math.min(this._focusedIndex + 1, this._filteredOptions.length - 1);
                    this._updateFocusedOption();
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                this._keyboardNavigating = true;
                clearTimeout(this._keyboardTimer);
                this._keyboardTimer = window.setTimeout(() => { this._keyboardNavigating = false; }, 100);
                if (this._isOpen) {
                    if (this._focusedIndex === 0 && this.searchable) {
                        this._focusedIndex = -1;
                        this._updateFocusedOption();
                        requestAnimationFrame(() => {
                            const search = this.$('.search-input');
                            if (search) {
                                search.focus();
                                search.setSelectionRange(search.value.length, search.value.length);
                            }
                        });
                        return;
                    }
                    const search = this.$('.search-input');
                    if (this.searchable && search === this.shadowRoot.activeElement) return;
                    this._focusedIndex = Math.max(this._focusedIndex - 1, -1);
                    this._updateFocusedOption();
                }
                break;

            case 'Enter':
                e.preventDefault();
                if (this._isOpen && this._focusedIndex >= 0 && this._focusedIndex < this._filteredOptions.length) {
                    this.selectOption(this._filteredOptions[this._focusedIndex].value);
                } else if (!this._isOpen) {
                    this.open();
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.close();
                break;

            case 'Tab':
                this.close();
                break;
        }
    };

    /** @private */
    _render = () => {
        if (this._filteredOptions.length === 0 && this.options.length > 0) {
            this._filteredOptions = [...this.options];
        }

        const wasSearchFocused = this.$('.search-input') === this.shadowRoot.activeElement;

        // Build selected content
        let selectedHtml = '';
        if (this.multiple && this._selectedOptions.length > 0) {
            selectedHtml = this._selectedOptions.map((o) => `
                <span class="tag">
                    ${o.image ? `<img src="${_esc(o.image)}" class="tag-img" alt="">` : ''}
                    ${_esc(o.label)}
                    <span class="remove-tag" data-value="${_esc(o.value)}">×</span>
                </span>
            `).join('');
        } else if (this._selectedOptions.length > 0) {
            const o = this._selectedOptions[0];
            selectedHtml = `<span class="single-value">
                ${o.image ? `<img src="${_esc(o.image)}" class="single-img" alt="">` : ''}
                <span>${_esc(o.label)}</span>
            </span>`;
        } else {
            selectedHtml = `<span class="placeholder">${_esc(this.placeholder)}</span>`;
        }

        // Build dropdown
        let dropdownHtml = '';
        if (this._isOpen) {
            const searchHtml = this.searchable
                ? `<input type="text" class="search-input" placeholder="Search..." value="${_esc(this._searchValue)}">`
                : '';

            const optionsHtml = this._filteredOptions.length > 0
                ? this._filteredOptions.map((o, i) => {
                    const isSelected = this._selectedOptions.some((s) => s.value === o.value);
                    const isFocused = i === this._focusedIndex;
                    return `<div
                        class="option${isSelected ? ' selected' : ''}${isFocused ? ' focused' : ''}"
                        data-value="${_esc(o.value)}"
                    >
                        ${o.image ? `<img src="${_esc(o.image)}" class="option-img" alt="">` : ''}
                        <span>${_esc(o.label)}</span>
                    </div>`;
                }).join('')
                : '<div class="no-options">No options found</div>';

            dropdownHtml = `<div class="dropdown">${searchHtml}${optionsHtml}</div>`;
        }

        this.render(STYLES, `
            <div class="trigger" tabindex="-1">
                <div class="selected-content">${selectedHtml}</div>
                <div class="arrow${this._isOpen ? ' open' : ''}"></div>
            </div>
            ${dropdownHtml}
        `);

        if (this._isOpen) {
            const dropdown = this.$('.dropdown');
            if (dropdown) {
                // Safe to add per-render: the .dropdown element is recreated by innerHTML on each
                // _render() call, so its listeners are discarded with it. No accumulation occurs.
                dropdown.addEventListener('mouseleave', () => {
                    if (this._keyboardNavigating) return;
                    this.$('.option.focused')?.classList.remove('focused');
                    this._focusedIndex = -1;
                });
            }
        }

        if (wasSearchFocused && this.searchable && this._isOpen) {
            requestAnimationFrame(() => {
                const input = this.$('.search-input');
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            });
        }

        if (this._isOpen) this._updateDropdownPosition();
    };
}

export { WoxSelect };
