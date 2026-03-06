// wox-date-picker.js — Calendar date picker with single and range selection

import { WoxElement } from './wox-base.js';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const YEAR_RANGE = 10;

const STYLES = `
    :host {
        display: block;
        width: 280px;
        background: var(--wox-bg-panel, #17171a);
        border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-md, 6px);
        box-shadow: var(--wox-shadow-md, 0 4px 16px rgba(0,0,0,0.4));
        padding: 12px;
        user-select: none;
        font-family: var(--wox-font, 'Inter', sans-serif);
        font-size: var(--wox-font-size-base, 12px);
        color: var(--wox-text-primary, #eee);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .month-year {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;
        font-size: 13px;
        color: var(--wox-text-primary, #eee);
    }

    .year-select {
        background: transparent;
        border: none;
        color: var(--wox-text-primary, #eee);
        font-size: 13px;
        font-weight: 600;
        font-family: var(--wox-font, sans-serif);
        cursor: pointer;
        padding: 2px 4px;
        border-radius: var(--wox-radius-md, 6px);
        outline: none;
    }

    .year-select:hover {
        background: var(--wox-bg-hover, #2a2a2e);
    }

    .year-select option {
        background: var(--wox-bg-panel, #17171a);
        color: var(--wox-text-primary, #eee);
    }

    .nav-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--wox-text-secondary, #999);
        width: 26px;
        height: 26px;
        border-radius: var(--wox-radius-md, 6px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        line-height: 1;
        transition: background 0.12s, color 0.12s;
        padding: 0;
    }

    .nav-btn:hover {
        background: var(--wox-bg-hover, #2a2a2e);
        color: var(--wox-text-primary, #eee);
    }

    .day-headers {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        margin-bottom: 2px;
    }

    .day-header {
        text-align: center;
        font-size: 10px;
        font-weight: 600;
        color: var(--wox-text-secondary, #999);
        padding: 4px 0;
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
    }

    .day-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        border-radius: var(--wox-radius-md, 6px);
        cursor: pointer;
        transition: background 0.1s, color 0.1s;
        color: var(--wox-text-primary, #eee);
        position: relative;
    }

    .day-cell:hover {
        background: var(--wox-bg-hover, #2a2a2e);
    }

    .day-cell.other-month {
        color: var(--wox-text-secondary, #999);
        opacity: 0.4;
    }

    .day-cell.today {
        outline: 1px solid var(--wox-accent, #00e5ff);
        outline-offset: -1px;
        color: var(--wox-accent, #00e5ff);
        font-weight: 600;
    }

    .day-cell.selected {
        background: var(--wox-accent, #00e5ff);
        color: #000;
        font-weight: 600;
    }

    .day-cell.selected:hover {
        background: var(--wox-accent, #00e5ff);
    }

    .day-cell.range-start,
    .day-cell.range-end {
        background: var(--wox-accent, #00e5ff);
        color: #000;
        font-weight: 600;
    }

    .day-cell.range-start:hover,
    .day-cell.range-end:hover {
        background: var(--wox-accent, #00e5ff);
    }

    .day-cell.in-range {
        background: rgba(0, 229, 255, 0.15);
        border-radius: 0;
    }

    .day-cell.range-start { border-radius: var(--wox-radius-md, 6px) 0 0 var(--wox-radius-md, 6px); }
    .day-cell.range-end   { border-radius: 0 var(--wox-radius-md, 6px) var(--wox-radius-md, 6px) 0; }

    .day-cell.range-hover {
        background: rgba(0, 229, 255, 0.08);
    }

    .day-cell.disabled {
        pointer-events: none;
        opacity: 0.25;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        gap: 8px;
    }

    .mode-hint {
        font-size: 10px;
        color: var(--wox-text-secondary, #999);
        flex: 1;
    }

    .today-btn {
        background: none;
        border: 1px solid var(--wox-border, #333);
        border-radius: var(--wox-radius-md, 6px);
        color: var(--wox-text-secondary, #999);
        font-size: 10px;
        font-family: var(--wox-font, sans-serif);
        cursor: pointer;
        padding: 3px 8px;
        transition: background 0.12s, color 0.12s, border-color 0.12s;
    }

    .today-btn:hover {
        background: var(--wox-bg-hover, #2a2a2e);
        color: var(--wox-accent, #00e5ff);
        border-color: var(--wox-accent, #00e5ff);
    }

    :host([disabled]) {
        opacity: 0.4;
        pointer-events: none;
    }
`;

/**
 * <wox-date-picker> — Calendar date picker with single and range selection.
 * Ported from DateSelectorElement (liwe3-webcomponents).
 *
 * @attr {boolean} range-mode   - Enable range selection (start + end date)
 * @attr {string}  value        - Selected date (YYYY-MM-DD), single mode only
 * @attr {string}  range-start  - Range start date (YYYY-MM-DD), range mode only
 * @attr {string}  range-end    - Range end date (YYYY-MM-DD), range mode only
 * @attr {boolean} disabled     - Disables all interaction
 *
 * @fires wox-change - Single mode: detail { date }. Range mode (both set): detail { start, end }
 */
class WoxDatePicker extends WoxElement {
    static observedAttributes = ['range-mode', 'value', 'range-start', 'range-end', 'disabled'];

    /** @type {Date} Currently viewed month/year */
    _currentDate = new Date();

    /** @type {string|null} Selected date in single mode (YYYY-MM-DD) */
    _selectedDate = null;

    /** @type {{ start: string|null, end: string|null }} */
    _selectedRange = { start: null, end: null };

    connectedCallback() {
        // Bind shadow event delegation once
        this._boundShadowClick = (e) => {
            if (this.hasAttribute('disabled')) return;
            const btn = e.target.closest('button');
            if (btn) {
                if (btn.id === 'prev-month') { this._navigateMonth(-1); return; }
                if (btn.id === 'next-month') { this._navigateMonth(1);  return; }
                if (btn.classList.contains('today-btn')) { this._goToday(); return; }
            }
            const cell = e.target.closest('.day-cell');
            if (cell) { this._handleDayClick(cell); return; }
        };
        this._boundShadowChange = (e) => {
            if (e.target.classList.contains('year-select')) {
                this._navigateToYear(parseInt(e.target.value, 10));
            }
        };
        this._boundShadowMouseover = (e) => {
            if (!this.hasAttribute('range-mode')) return;
            const cell = e.target.closest('.day-cell');
            if (cell && this._selectedRange.start && !this._selectedRange.end) {
                this._updateRangeHover(cell.dataset.date);
            }
        };
        this._boundShadowMouseleave = () => {
            this._clearRangeHover();
        };

        this.shadowRoot.addEventListener('click', this._boundShadowClick);
        this.shadowRoot.addEventListener('change', this._boundShadowChange);
        this.shadowRoot.addEventListener('mouseover', this._boundShadowMouseover);
        this.addEventListener('mouseleave', this._boundShadowMouseleave);

        this._render();
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener('click', this._boundShadowClick);
        this.shadowRoot.removeEventListener('change', this._boundShadowChange);
        this.shadowRoot.removeEventListener('mouseover', this._boundShadowMouseover);
        this.removeEventListener('mouseleave', this._boundShadowMouseleave);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal || !this.isConnected) return;
        if (name === 'range-mode') {
            this._selectedDate = null;
            this._selectedRange = { start: null, end: null };
        } else if (name === 'value' && newVal !== null) {
            this._selectedDate = newVal;
            const d = _parseLocalDate(newVal);
            this._currentDate = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (name === 'range-start') {
            this._selectedRange.start = newVal;
        } else if (name === 'range-end') {
            this._selectedRange.end = newVal;
        }
        this._render();
    }

    // ── Getters / Setters ───────────────────────────────────────────────────────

    /** @type {boolean} Enables range selection mode. */
    get rangeMode() { return this.hasAttribute('range-mode'); }
    set rangeMode(v) { v ? this.setAttribute('range-mode', '') : this.removeAttribute('range-mode'); }

    /** @type {boolean} Disables all interaction. */
    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

    // ── Public API ──────────────────────────────────────────────────────────────

    /**
     * Selects a date in single mode and navigates to its month.
     * @param {string} dateStr - YYYY-MM-DD
     */
    setDate(dateStr) {
        if (this.rangeMode) return;
        this._selectedDate = dateStr;
        const d = _parseLocalDate(dateStr);
        this._currentDate = new Date(d.getFullYear(), d.getMonth(), 1);
        this._render();
    }

    /**
     * Sets both range endpoints and navigates to the start month.
     * @param {string} start - YYYY-MM-DD
     * @param {string} end   - YYYY-MM-DD
     */
    setRange(start, end) {
        if (!this.rangeMode) return;
        this._selectedRange = { start, end };
        const d = _parseLocalDate(start);
        this._currentDate = new Date(d.getFullYear(), d.getMonth(), 1);
        this._render();
    }

    /** @returns {string|null} */
    getSelectedDate() { return this._selectedDate; }

    /** @returns {{ start: string|null, end: string|null }} */
    getSelectedRange() { return { ...this._selectedRange }; }

    /** Clears selection and re-renders. */
    clear() {
        this._selectedDate = null;
        this._selectedRange = { start: null, end: null };
        this._render();
    }

    // ── Private ─────────────────────────────────────────────────────────────────

    /** @private */
    _navigateMonth = (dir) => {
        const y = this._currentDate.getFullYear();
        const m = this._currentDate.getMonth() + dir;
        this._currentDate = new Date(y, m, 1); // Date handles under/overflow automatically
        this._render();
    };

    /** @private */
    _navigateToYear = (year) => {
        this._currentDate = new Date(year, this._currentDate.getMonth(), 1);
        this._render();
    };

    /** @private */
    _goToday = () => {
        const today = new Date();
        const todayStr = _toDateStr(today);
        this._currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
        // In range mode, "Today" starts a new range from today without emitting —
        // the user still needs to click a second date to complete the range.
        if (this.rangeMode) {
            this._selectedRange = { start: todayStr, end: null };
        } else {
            this._selectedDate = todayStr;
            this.emit('wox-change', { date: todayStr });
        }
        this._render();
    };

    /** @private */
    _handleDayClick = (cell) => {
        const dateStr = cell.dataset.date;
        if (!dateStr) return;
        // If clicking another month's day, navigate there
        if (cell.classList.contains('other-month')) {
            const d = _parseLocalDate(dateStr);
            this._currentDate = new Date(d.getFullYear(), d.getMonth(), 1);
        }
        if (this.rangeMode) {
            this._handleRangeSelection(dateStr);
        } else {
            this._selectedDate = dateStr;
            this.emit('wox-change', { date: dateStr });
            this._render();
        }
    };

    /** @private */
    _handleRangeSelection = (dateStr) => {
        if (!this._selectedRange.start || this._selectedRange.end) {
            this._selectedRange = { start: dateStr, end: null };
        } else {
            // Ensure start <= end; swap if needed
            if (dateStr < this._selectedRange.start) {
                this._selectedRange = { start: dateStr, end: this._selectedRange.start };
            } else {
                this._selectedRange.end = dateStr;
            }
            this.emit('wox-change', { start: this._selectedRange.start, end: this._selectedRange.end });
        }
        this._render();
    };

    /** @private DOM manipulation only — no re-render */
    _updateRangeHover = (hoverDate) => {
        if (!hoverDate) return;
        const start = this._selectedRange.start;
        this.$$('.day-cell:not(.other-month)').forEach((cell) => {
            const cd = cell.dataset.date;
            cell.classList.toggle('range-hover', cd > start && cd <= hoverDate);
        });
    };

    /** @private */
    _clearRangeHover = () => {
        this.$$('.day-cell.range-hover').forEach((c) => c.classList.remove('range-hover'));
    };

    /** @private */
    _generateYearOptions = (currentYear) => {
        let html = '';
        for (let y = currentYear - YEAR_RANGE; y <= currentYear + YEAR_RANGE; y++) {
            html += `<option value="${y}"${y === currentYear ? ' selected' : ''}>${y}</option>`;
        }
        return html;
    };

    /** @private */
    _generateGrid = (year, month) => {
        const today = new Date();
        const todayStr = _toDateStr(today);
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let cells = '';

        // Prev-month trailing days
        const prevY = month === 0 ? year - 1 : year;
        const prevM = month === 0 ? 11 : month - 1;
        const daysInPrev = new Date(prevY, prevM + 1, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            const d = daysInPrev - i;
            const ds = _padDate(prevY, prevM, d);
            cells += `<div class="day-cell other-month" data-date="${ds}">${d}</div>`;
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            const ds = _padDate(year, month, d);
            let cls = 'day-cell';
            if (ds === todayStr) cls += ' today';
            if (this.rangeMode) {
                if (this._selectedRange.start && ds === this._selectedRange.start) cls += ' range-start';
                else if (this._selectedRange.end && ds === this._selectedRange.end) cls += ' range-end';
                else if (_isInRange(ds, this._selectedRange.start, this._selectedRange.end)) cls += ' in-range';
            } else {
                if (this._selectedDate && ds === this._selectedDate) cls += ' selected';
            }
            cells += `<div class="${cls}" data-date="${ds}">${d}</div>`;
        }

        // Next-month leading days
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        const nextY = month === 11 ? year + 1 : year;
        const nextM = month === 11 ? 0 : month + 1;
        for (let d = 1; d <= totalCells - firstDay - daysInMonth; d++) {
            const ds = _padDate(nextY, nextM, d);
            cells += `<div class="day-cell other-month" data-date="${ds}">${d}</div>`;
        }

        return cells;
    };

    /** @private */
    _getModeHint = () => {
        if (!this.rangeMode) return 'Select a date';
        if (!this._selectedRange.start) return 'Select start date';
        if (!this._selectedRange.end) return 'Select end date';
        return `${this._selectedRange.start} → ${this._selectedRange.end}`;
    };

    /** @private */
    _render = () => {
        const year = this._currentDate.getFullYear();
        const month = this._currentDate.getMonth();

        this.render(STYLES, `
            <div class="header">
                <button class="nav-btn" id="prev-month">&#8249;</button>
                <div class="month-year">
                    ${MONTH_NAMES[month]}
                    <select class="year-select">${this._generateYearOptions(year)}</select>
                </div>
                <button class="nav-btn" id="next-month">&#8250;</button>
            </div>
            <div class="day-headers">
                ${DAY_NAMES.map((d) => `<div class="day-header">${d}</div>`).join('')}
            </div>
            <div class="calendar-grid">
                ${this._generateGrid(year, month)}
            </div>
            <div class="footer">
                <span class="mode-hint">${this._getModeHint()}</span>
                <button class="today-btn">Today</button>
            </div>
        `);
    };
}

// ── Module-level helpers ────────────────────────────────────────────────────

/** @param {Date} d @returns {string} YYYY-MM-DD */
const _toDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Parses a YYYY-MM-DD string to a local Date, avoiding UTC-offset issues.
 * @param {string} dateStr
 * @returns {Date}
 */
const _parseLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

/** @param {number} y @param {number} m @param {number} d @returns {string} */
const _padDate = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/**
 * Returns true if dateStr is strictly between start and end.
 * @param {string} dateStr @param {string|null} start @param {string|null} end
 */
const _isInRange = (dateStr, start, end) => {
    if (!start || !end) return false;
    return dateStr > start && dateStr < end;
};

customElements.define('wox-date-picker', WoxDatePicker);
export { WoxDatePicker };
