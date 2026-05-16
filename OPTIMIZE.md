# Optimization TODO

> Generated 2026-05-16. Items sorted by importance.

## Critical

- [x] **[XSS] Datagrid renders cell values via `innerHTML` unsanitized** — `row[col.key]` is injected directly into the cell template string; any HTML or script in data executes in the page context.
  - File: `src/wox-datagrid.js` (line 197)

- [x] **[XSS] Toast `message` param injected into `innerHTML`** — the public API accepts "plain text or simple HTML", but callers passing user-generated content are silently vulnerable to XSS. Use `textContent` for the default path and opt-in HTML only explicitly.
  - File: `src/wox-toast.js` (line 205)

## High

- [x] **[Perf] Datagrid re-binds all event listeners after every `_render()` call** — `_bindEvents()` attaches click/dblclick/drag/resize handlers to every header cell, row, and cell on each sort, column swap, or cell edit. For 100 rows × 10 columns that is ~1 000 listener registrations per user interaction. Use event delegation on the `.header` and `.body` containers instead.
  - File: `src/wox-datagrid.js` (`_bindEvents`, `_render`)

- [x] **[Perf] `wox-input` does a full shadow-DOM rebuild on every attribute change** — changing `disabled`, `placeholder`, or any non-value attribute destroys and recreates the `<input>` element, losing focus and cursor position. Only `value` is handled incrementally. Other attributes should update existing DOM nodes in-place.
  - File: `src/wox-input.js` (`attributeChangedCallback`, `_render`)

- [x] **[Perf] `wox-modal` re-renders (full innerHTML) on every observed attribute change** — with six observed attributes (`title`, `width`, `closable`, `color`, `glow`, `pulse`), the entire modal chrome is rebuilt and all event listeners re-attached for each change. Cache the rendered state and update individual attributes in-place.
  - File: `src/wox-modal.js` (`attributeChangedCallback`, `_render`)

## Medium

- [x] **[Perf] `_labelForValue` runs O(n) `gradientToCSS` calls on every preview update** — for each update it iterates all saved gradients and calls `gradientToCSS` on each to find a name match. Cache the CSS string per gradient on save/load, or look up by gradient ID stored alongside the current value.
  - File: `src/wox-gradient-selector.js` (`_labelForValue`, called from `_updatePreview` and `_build`)

- [x] **[Perf] `JSON.parse(JSON.stringify(...))` used as deep clone throughout** — used 6+ times across the gradient components. Replace with `structuredClone()` (supported in all target browsers), which is faster, handles more types, and is semantically clearer.
  - Files: `src/wox-gradient-selector.js`, `src/wox-gradient-editor.js`

- [x] **[Perf] `wox-select` rebuilds the full shadow DOM on every open/close** — `open()`, `close()`, `_handleSearch()`, and `selectOption()` all call `_render()` which replaces `shadowRoot.innerHTML`. The trigger and dropdown could be rendered once; open/close should only toggle a CSS class or `display` style.
  - File: `src/wox-select.js` (`_render`, `open`, `close`)

- [x] **[Memory] `WoxElement` base methods are arrow functions defined per-instance** — `render`, `emit`, `$`, and `$$` are arrow function class fields, so each component instance carries its own copy instead of sharing via the prototype. Converting them to regular prototype methods saves memory proportional to the number of mounted components.
  - File: `src/wox-base.js`

- [x] **[Perf] `wox-gradient-selector` speed slider duplicates identical handlers for `wox-input` and `wox-change`** — both events trigger the same exact code block (update `_animationSpeed`, toggle anim row visibility, emit change). Extract to a shared handler and register it once for both events.
  - File: `src/wox-gradient-selector.js` (`_bindEvents`, lines ~443-455)

## Low / Nice to have

- [x] **[Perf] `_getSortedRows()` called twice inside the same render path** — inside `_render()` the sorted array is computed at line 169, then computed again at line 215 (shadowed variable) when setting up the cell-edit input. Cache the first result in a local variable.
  - File: `src/wox-datagrid.js` (`_render`)

- [ ] **[Correctness] `wox-gradient-editor` stop `indexOf` is O(n) per handle** — `_renderStops` iterates the sorted copy and uses `indexOf` to map each stop back to its original index. For small stop counts (typically 2-5) this is acceptable, but storing the original index as a `data-index` on the element at sort time is cleaner and avoids any reference-equality surprises.
  - File: `src/wox-gradient-editor.js` (`_renderStops`, line 194)

- [ ] **[UX] `wox-context-menu` global listeners are registered once and never removed** — `_listenersReady` is set to `true` on first `show()` and global `click`/`contextmenu`/`keydown` handlers are attached permanently. If the component is ever used in a teardown scenario (e.g. SPA navigation), these listeners leak. Add a `WoxContextMenu.destroy()` that removes them.
  - File: `src/wox-context-menu.js` (`show`, `_listenersReady`)

- [ ] **[Quality] `wox-slider` duplicates value-format logic between `_formatVal()` and the inline `update()` closure in `_attachDrag()`** — the unit/step formatting is written twice. `update()` should call `_formatVal()` instead of repeating the branching logic.
  - File: `src/wox-slider.js` (`_attachDrag` → `update`, `_formatVal`)
