// wox-layer-item.js — Layer row with name, visibility toggle, lock toggle

import { WoxElement } from './wox-base.js';

const STYLES = `
    :host { display: block; }
    .layer {
        display: flex; align-items: center; gap: 6px; padding: 6px 10px 6px 12px;
        margin: 4px 8px 0 8px; border-radius: var(--wox-radius-md, 6px);
        background: rgba(255, 255, 255, 0.04); border: 1px solid transparent;
        cursor: pointer; user-select: none; font-size: var(--wox-font-size-md, 11px);
        font-weight: 600; color: var(--wox-text-secondary, #999); text-transform: uppercase;
        letter-spacing: 0.5px; transition: background 0.1s, border-color 0.1s;
    }
    :host([depth="1"]) .layer { margin-left: 24px; }
    :host([depth="2"]) .layer { margin-left: 40px; }
    .layer:hover { background: rgba(255, 255, 255, 0.07); }
    .layer.selected { border-color: var(--wox-accent, #00e5ff); color: var(--wox-accent, #00e5ff); background: rgba(0, 229, 255, 0.06); }
    .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--wox-font-size-lg, 13px); color: #ccc; font-weight: 400; text-transform: none; letter-spacing: 0; }
    .layer.selected .name { color: var(--wox-text-hi, #fff); }
    .name-input {
        flex: 1; background: rgba(0, 0, 0, 0.4); border: 1px solid #4A8CFF;
        color: #fff; font-size: var(--wox-font-size-lg, 13px); font-family: var(--wox-font, sans-serif);
        padding: 2px 4px; border-radius: var(--wox-radius-sm, 3px); outline: none; width: 100%;
    }
    .type-icon { font-size: 14px; opacity: 0.6; width: 18px; text-align: center; }
    .material-icons { font-family: 'Material Icons'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; }
    .toggle { display: flex; align-items: center; opacity: 0.4; cursor: pointer; transition: opacity 0.15s, color 0.15s; padding: 0 2px; font-size: 16px; }
    .toggle:hover, .toggle.on { opacity: 1; color: var(--wox-accent, #00e5ff); }
`;

const TYPE_ICONS = {
    rectangle: 'crop_square',
    ellipse: 'radio_button_unchecked',
    path: 'timeline',
    image: 'image',
    text: 'text_fields',
    group: 'folder',
    layer: 'layers',
};

/**
 * <wox-layer-item> — A layer row in the layers panel.
 * @attr {string}  name     - Layer/shape name
 * @attr {string}  type     - Shape type for icon (rectangle, ellipse, path, image, text, group, layer)
 * @attr {boolean} visible  - Visibility state
 * @attr {boolean} locked   - Lock state
 * @attr {boolean} selected - Selected state
 * @attr {number}  depth    - Nesting depth (0, 1, 2)
 * @fires wox-select     - On click, detail: { name }
 * @fires wox-visibility - On eye toggle, detail: { visible }
 * @fires wox-lock       - On lock toggle, detail: { locked }
 */
class WoxLayerItem extends WoxElement {
    static observedAttributes = ['name', 'type', 'visible', 'locked', 'selected', 'depth'];

    connectedCallback() {
        this._editing = false;
        this._render();
    }

    attributeChangedCallback() {
        if (this.isConnected && !this._editing) this._render();
    }

    /** @private */
    _render = () => {
        const name = this.getAttribute('name') || 'Layer';
        const type = this.getAttribute('type') || 'layer';
        const visible = this.hasAttribute('visible');
        const locked = this.hasAttribute('locked');
        const selected = this.hasAttribute('selected');
        const iconName = TYPE_ICONS[type] || 'layers';

        this.render(STYLES, `
            <div class="layer ${selected ? 'selected' : ''}">
                <span class="type-icon material-icons">${iconName}</span>
                <span class="name">${name}</span>
                <span class="toggle eye ${visible ? 'on' : ''} material-icons">${visible ? 'visibility' : 'visibility_off'}</span>
                <span class="toggle lock ${locked ? 'on' : ''} material-icons">${locked ? 'lock' : 'lock_open'}</span>
            </div>
        `);

        // Select on click
        this.$('.layer').addEventListener('click', (e) => {
            if (e.target.closest('.toggle')) return;
            this.emit('wox-select', { name });
        });

        // Double-click to rename
        this.$('.name').addEventListener('dblclick', () => this._startEditing());

        // Eye toggle
        this.$('.eye').addEventListener('click', (e) => {
            e.stopPropagation();
            const newVisible = !visible;
            if (newVisible) this.setAttribute('visible', '');
            else this.removeAttribute('visible');
            this.emit('wox-visibility', { visible: newVisible });
        });

        // Lock toggle
        this.$('.lock').addEventListener('click', (e) => {
            e.stopPropagation();
            const newLocked = !locked;
            if (newLocked) this.setAttribute('locked', '');
            else this.removeAttribute('locked');
            this.emit('wox-lock', { locked: newLocked });
        });
    };

    /** @private */
    _startEditing = () => {
        this._editing = true;
        const nameEl = this.$('.name');
        const currentName = this.getAttribute('name') || 'Layer';
        const input = document.createElement('input');
        input.className = 'name-input';
        input.value = currentName;
        nameEl.replaceWith(input);
        input.focus();
        input.select();

        const finish = () => {
            this._editing = false;
            const newName = input.value.trim() || currentName;
            this.setAttribute('name', newName);
            this._render();
        };

        input.addEventListener('blur', finish);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') { input.value = currentName; input.blur(); }
        });
    };
}

export { WoxLayerItem };
