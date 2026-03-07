// wox-datagrid.js — Sortable, resizable-column data grid component

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: block; overflow: hidden; border: 1px solid var(--wox-border, #333); border-radius: var(--wox-radius-md, 6px); background: var(--wox-bg-panel, #17171a); }

    .grid-wrapper { display: flex; flex-direction: column; height: 100%; overflow: hidden; }

    /* ── Header ── */
    .header {
        display: flex; flex-shrink: 0;
        background: var(--wox-bg-section-header, #22222a);
        border-bottom: 1px solid var(--wox-border, #333);
        user-select: none;
    }
    .header-cell {
        position: relative; display: flex; align-items: center; gap: 4px;
        padding: 0 12px; height: 32px; flex-shrink: 0; overflow: hidden;
        font-size: var(--wox-font-size-sm, 10px); font-weight: 600;
        text-transform: uppercase; letter-spacing: 0.5px;
        color: var(--wox-text-secondary, #999); cursor: pointer;
        transition: color var(--wox-transition-fast, 0.12s);
    }
    .header-cell:hover { color: var(--wox-text-hi, #fff); }
    .header-cell.sorted { color: var(--wox-accent, #00e5ff); }

    /* Sort arrow */
    .sort-arrow { font-size: 14px; opacity: 0; transition: opacity 0.15s, transform 0.15s; line-height: 1; }
    .header-cell:hover .sort-arrow { opacity: 0.4; }
    .header-cell.sorted .sort-arrow { opacity: 1; }
    .header-cell.sorted.desc .sort-arrow { transform: rotate(180deg); }

    /* Resize handle */
    .resize-handle {
        position: absolute; top: 0; right: 0; width: 5px; height: 100%;
        cursor: col-resize; z-index: 1;
    }
    .resize-handle::after {
        content: ''; position: absolute; top: 6px; bottom: 6px; right: 2px; width: 1px;
        background: var(--wox-border-light, #444);
        transition: background var(--wox-transition-fast, 0.12s);
    }
    .resize-handle:hover::after, .resize-handle.active::after {
        background: var(--wox-accent, #00e5ff);
    }

    .header-cell.dragging { opacity: 0.4; background: var(--wox-bg-hover, #2a2a2e); }
    .header-cell.drag-over { border-left: 2px solid var(--wox-accent, #00e5ff); }

    /* ── Body ── */
    .body {
        flex: 1; overflow-y: auto; overflow-x: hidden;
        scrollbar-width: thin; scrollbar-color: var(--wox-border, #333) transparent;
    }
    .body::-webkit-scrollbar { width: 6px; }
    .body::-webkit-scrollbar-thumb { background: var(--wox-border, #333); border-radius: 3px; }

    /* ── Rows ── */
    .row {
        display: flex; border-bottom: 1px solid var(--wox-border-section, #2e2e2e);
        transition: background var(--wox-transition-fast, 0.12s);
        cursor: default;
    }
    .row.even { background: var(--wox-bg-panel, #17171a); }
    .row.odd  { background: var(--wox-bg-toolbar, #1e1e22); }
    .row:hover { background: var(--wox-bg-hover, #2a2a2e); }

    .cell {
        display: flex; align-items: center;
        padding: 0 12px; height: 30px; flex-shrink: 0; overflow: hidden;
        font-size: var(--wox-font-size-base, 12px); color: var(--wox-text-primary, #eee);
        white-space: nowrap; text-overflow: ellipsis;
    }
    .cell.align-right  { justify-content: flex-end; }
    .cell.align-center { justify-content: center; }
    
    .cell-input {
        width: 100%; height: 24px; background: #222; border: 1px solid var(--wox-accent, #00e5ff);
        color: #fff; padding: 2px 4px; border-radius: 4px; font-size: 11px; outline: none;
    }

    /* ── Empty state ── */
    .empty {
        display: flex; align-items: center; justify-content: center;
        height: 80px; color: var(--wox-text-secondary, #999);
        font-size: var(--wox-font-size-md, 11px); font-style: italic;
    }
`;

const DEFAULT_COL_WIDTH = 120;
const MIN_COL_WIDTH = 40;

/**
 * <wox-datagrid> — Sortable data grid with resizable columns.
 *
 * Data is set via JavaScript properties:
 *   grid.columns = [{ key, label, width?, align?, sortable? }]
 *   grid.rows    = [{ key: value, ... }]
 *
 * @fires wox-sort      - { key, direction } when sort changes
 * @fires wox-row-click - { row, index } when a row is clicked
 */
class WoxDatagrid extends WoxElement {
    /** @private */
    _columns = [];
    /** @private */
    _rows = [];
    /** @private */
    _sortKey = null;
    /** @private */
    _sortDir = 'asc';
    /** @private */
    _colWidths = [];
    /** @private */
    _editingCell = null; // { rowIndex: number, key: string }

    connectedCallback() {
        this._render();
    }

    /**
     * Sets the column definitions.
     * @param {Array<{key: string, label: string, width?: number, align?: string, sortable?: boolean}>} cols
     */
    set columns(cols) {
        this._columns = cols || [];
        this._colWidths = this._columns.map(c => c.width || DEFAULT_COL_WIDTH);
        this._sortKey = null;
        this._sortDir = 'asc';
        this._render();
    }

    /** @returns {Array} current column definitions */
    get columns() { return this._columns; }

    /**
     * Sets the row data.
     * @param {Array<Object>} data
     */
    set rows(data) {
        this._rows = data || [];
        this._render();
    }

    /** @returns {Array} current row data */
    get rows() { return this._rows; }

    /** @private */
    _getSortedRows = () => {
        if (!this._sortKey) return this._rows;

        const key = this._sortKey;
        const dir = this._sortDir === 'asc' ? 1 : -1;

        return [...this._rows].sort((a, b) => {
            const va = a[key];
            const vb = b[key];
            if (va == null && vb == null) return 0;
            if (va == null) return dir;
            if (vb == null) return -dir;
            if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
            return String(va).localeCompare(String(vb)) * dir;
        });
    };

    /** @private */
    _render = () => {
        const sorted = this._getSortedRows();

        const headerCells = this._columns.map((col, i) => {
            const isSorted = this._sortKey === col.key;
            const cls = [isSorted ? 'sorted' : '', isSorted && this._sortDir === 'desc' ? 'desc' : ''].filter(Boolean).join(' ');
            const sortable = col.sortable !== false;
            return `<div class="header-cell ${cls}" data-col="${i}" style="width:${this._colWidths[i]}px" draggable="true">
                <span class="label-text">${col.label || col.key}</span>
                ${sortable ? '<span class="sort-arrow">&#9650;</span>' : ''}
                <div class="resize-handle" data-col="${i}"></div>
            </div>`;
        }).join('');

        const bodyRows = sorted.length === 0
            ? '<div class="empty">No data</div>'
            : sorted.map((row, ri) => {
                const parity = ri % 2 === 0 ? 'even' : 'odd';
                const cells = this._columns.map((col, ci) => {
                    const align = col.align ? ` align-${col.align}` : '';
                    const isEditing = this._editingCell && this._editingCell.rowIndex === ri && this._editingCell.key === col.key;
                    const val = row[col.key] != null ? row[col.key] : '';

                    if (isEditing) {
                        return `<div class="cell${align}" style="width:${this._colWidths[ci]}px" data-key="${col.key}">
                            <input class="cell-input" spellcheck="false">
                        </div>`;
                    }

                    return `<div class="cell${align}" style="width:${this._colWidths[ci]}px" data-key="${col.key}">${val}</div>`;
                }).join('');
                return `<div class="row ${parity}" data-row="${ri}">${cells}</div>`;
            }).join('');

        this.render(STYLES, `
            <div class="grid-wrapper">
                <div class="header">${headerCells}</div>
                <div class="body">${bodyRows}</div>
            </div>
        `);

        this._bindEvents();

        if (this._editingCell) {
            const input = this.$('.cell-input');
            if (input) {
                const { rowIndex, key } = this._editingCell;
                const sorted = this._getSortedRows();
                let originalVal = sorted[rowIndex][key] != null ? sorted[rowIndex][key] : '';

                // Strip HTML if present for clean editing
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = originalVal;
                const cleanVal = tempDiv.textContent || tempDiv.innerText || originalVal;

                input.value = cleanVal;
                input.dataset.oldValue = cleanVal; // Store the clean version for easier comparison and matching in the app

                input.focus();
                input.select();

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this._commitEdit(input.value);
                    } else if (e.key === 'Escape') {
                        this._editingCell = null;
                        this._render();
                    }
                });

                input.addEventListener('blur', () => {
                    this._commitEdit(input.value);
                });
            }
        }
    };

    /** @private */
    _commitEdit = (newVal) => {
        if (!this._editingCell) return;
        const { rowIndex, key } = this._editingCell;
        const input = this.$('.cell-input');
        const originalVal = input ? input.dataset.oldValue : '';
        const sorted = this._getSortedRows();
        const row = sorted[rowIndex];

        if (originalVal !== newVal) {
            // Emit change event
            this.emit('wox-cell-change', { row, key, oldValue: originalVal, newValue: newVal });
            // Update local row (might be overwritten by outside refresh)
            row[key] = newVal;
        }

        this._editingCell = null;
        this._render();
    };

    /** @private */
    _bindEvents = () => {
        // Sort on header click
        this.$$('.header-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (e.target.closest('.resize-handle')) return;
                const idx = Number(cell.dataset.col);
                const col = this._columns[idx];
                if (col.sortable === false) return;

                if (this._sortKey === col.key) {
                    this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
                } else {
                    this._sortKey = col.key;
                    this._sortDir = 'asc';
                }

                this.emit('wox-sort', { key: this._sortKey, direction: this._sortDir });
                this._render();
            });

            // Reordering via Drag & Drop
            cell.addEventListener('dragstart', (e) => {
                const idx = cell.dataset.col;
                e.dataTransfer.setData('text/plain', idx);
                cell.classList.add('dragging');
            });

            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
                cell.classList.add('drag-over');
            });

            cell.addEventListener('dragleave', () => {
                cell.classList.remove('drag-over');
            });

            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                cell.classList.remove('drag-over');
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
                const toIdx = parseInt(cell.dataset.col, 10);

                if (fromIdx !== toIdx) {
                    this._swapColumns(fromIdx, toIdx);
                }
            });

            cell.addEventListener('dragend', () => {
                cell.classList.remove('dragging');
            });
        });

        // Row click
        this.$$('.row').forEach(row => {
            row.addEventListener('click', () => {
                const ri = Number(row.dataset.row);
                const sorted = this._getSortedRows();
                this.emit('wox-row-click', { row: sorted[ri], index: ri });
            });

            row.querySelectorAll('.cell').forEach(cell => {
                cell.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    const ri = Number(row.dataset.row);
                    const key = cell.dataset.key;
                    // Check if column is editable (default yes for now unless specified otherwise)
                    const colIdx = this._columns.findIndex(c => c.key === key);
                    if (this._columns[colIdx].editable === false) return;

                    this._editingCell = { rowIndex: ri, key: key };
                    this._render();
                });
            });
        });

        // Column resize
        this.$$('.resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const ci = Number(handle.dataset.col);
                const startX = e.clientX;
                const startW = this._colWidths[ci];
                handle.classList.add('active');

                const onMove = (ev) => {
                    const delta = ev.clientX - startX;
                    this._colWidths[ci] = Math.max(MIN_COL_WIDTH, startW + delta);
                    this._applyWidths();
                };

                const onUp = () => {
                    handle.classList.remove('active');
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
        });
    };

    /**
     * Updates column widths in-place without full re-render (for smooth resize).
     * @private
     */
    _applyWidths = () => {
        this.$$('.header-cell').forEach((cell, i) => {
            cell.style.width = `${this._colWidths[i]}px`;
        });
        this.$$('.row').forEach(row => {
            const cells = row.querySelectorAll('.cell');
            cells.forEach((cell, i) => {
                cell.style.width = `${this._colWidths[i]}px`;
            });
        });
    };

    /** @private */
    _swapColumns = (from, to) => {
        const cols = [...this._columns];
        const widths = [...this._colWidths];

        const [movedCol] = cols.splice(from, 1);
        cols.splice(to, 0, movedCol);

        const [movedWidth] = widths.splice(from, 1);
        widths.splice(to, 0, movedWidth);

        this._columns = cols;
        this._colWidths = widths;
        this._render();
    };
}

export { WoxDatagrid };
