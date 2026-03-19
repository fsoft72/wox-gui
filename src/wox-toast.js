// wox-toast.js — Toast notification system with slide animations and deduplication

import { WoxElement } from './wox-base.js';

/* ── constants ────────────────────────────────────── */

const DEFAULT_DURATION = 4000;
const ANIMATION_DURATION = 300;
const COLLAPSE_DURATION = 200;
const TOAST_GAP = 8;
const Z_INDEX = 99999;

/** Position codes -> CSS placement */
const POSITIONS = {
	TL: { top: '16px', left: '16px' },
	TC: { top: '16px', left: '50%', transform: 'translateX(-50%)' },
	TR: { top: '16px', right: '16px' },
	BL: { bottom: '16px', left: '16px' },
	BC: { bottom: '16px', left: '50%', transform: 'translateX(-50%)' },
	BR: { bottom: '16px', right: '16px' },
};

/** Slide direction per position */
const SLIDE_DIR = {
	TL: 'translateX(-120%)',
	TC: 'translateY(-120%)',
	TR: 'translateX(120%)',
	BL: 'translateX(-120%)',
	BC: 'translateY(120%)',
	BR: 'translateX(120%)',
};

/** Type -> dark-theme colour palette { bg, border, icon, progress, text } */
const TYPE_PALETTE = {
	success: { bg: '#1a2e1a', border: '#4CAF50', icon: '#66BB6A', progress: '#4CAF50', text: '#c8e6c9' },
	error:   { bg: '#2e1a1a', border: '#f44336', icon: '#ef5350', progress: '#f44336', text: '#ffcdd2' },
	warning: { bg: '#2e2a1a', border: '#FF9800', icon: '#FFA726', progress: '#FF9800', text: '#ffe0b2' },
	info:    { bg: '#1a222e', border: '#2196F3', icon: '#42A5F5', progress: '#2196F3', text: '#bbdefb' },
};

/** Type -> light-theme colour palette { bg, border, icon, progress, text } */
const TYPE_PALETTE_LIGHT = {
	success: { bg: '#e8f5e9', border: '#2e7d32', icon: '#388e3c', progress: '#2e7d32', text: '#1b5e20' },
	error:   { bg: '#fce4ec', border: '#c62828', icon: '#d32f2f', progress: '#c62828', text: '#b71c1c' },
	warning: { bg: '#fff8e1', border: '#e65100', icon: '#ef6c00', progress: '#e65100', text: '#bf360c' },
	info:    { bg: '#e3f2fd', border: '#1565c0', icon: '#1976d2', progress: '#1565c0', text: '#0d47a1' },
};

/** Get the active palette for a toast type based on current theme. */
const _getPalette = (type) => {
	const isLight = document.documentElement.dataset.woxTheme === 'light';
	const palettes = isLight ? TYPE_PALETTE_LIGHT : TYPE_PALETTE;
	return palettes[type] || palettes.info;
};

/** Inline SVG icons (20x20, stroke=currentColor) per type */
const ICONS = {
	success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
	error:   `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
	warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
	info:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
};

/* ── style injection ──────────────────────────────── */

let _styleInjected = false;

/** Inject the toast stylesheet once into <head> */
const _injectStyles = () => {
	if (_styleInjected) return;
	_styleInjected = true;

	const style = document.createElement('style');
	style.textContent = `
.wox-toast-container {
	position: fixed;
	display: flex;
	flex-direction: column;
	gap: ${TOAST_GAP}px;
	z-index: ${Z_INDEX};
	pointer-events: none;
}
.wox-toast {
	pointer-events: auto;
	display: flex;
	align-items: flex-start;
	gap: 10px;
	min-width: 280px;
	max-width: 420px;
	padding: 12px 14px;
	border-radius: var(--wox-radius-md, 6px);
	border-left: 4px solid transparent;
	box-shadow: var(--wox-shadow-md, 0 4px 16px rgba(0,0,0,.4));
	font-family: var(--wox-font, 'Inter', sans-serif);
	font-size: 14px;
	line-height: 1.4;
	overflow: hidden;
	position: relative;
}
.wox-toast-icon {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	margin-top: 1px;
}
.wox-toast-message {
	flex: 1;
	word-break: break-word;
}
.wox-toast-close {
	flex-shrink: 0;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0 0 0 4px;
	color: #666;
	font-size: 18px;
	line-height: 1;
	transition: color .15s;
}
.wox-toast-progress {
	position: absolute;
	bottom: 0;
	left: 0;
	height: 3px;
	border-radius: 0 0 0 var(--wox-radius-md, 6px);
}
`;
	document.head.appendChild(style);
};

/* ── deduplication ────────────────────────────────── */

/** @type {Set<string>} Active toast keys (type::message) to prevent duplicates */
const _activeToasts = new Set();

/* ── container cache ──────────────────────────────── */

/** @type {Record<string, HTMLDivElement>} */
const _containers = {};

/**
 * Get (or create) the container element for a given position code.
 * @param {string} pos - Position code (TL, TC, TR, BL, BC, BR)
 * @returns {HTMLDivElement}
 */
const _getContainer = (pos) => {
	if (_containers[pos]) return _containers[pos];

	const el = document.createElement('div');
	el.className = `wox-toast-container wox-toast-container-${pos}`;

	const placement = POSITIONS[pos];
	Object.assign(el.style, placement);

	/* bottom positions stack upward */
	if (pos.startsWith('B')) {
		el.style.flexDirection = 'column-reverse';
	}

	document.body.appendChild(el);
	_containers[pos] = el;
	return el;
};

/* ── core: create & show a toast ──────────────────── */

/**
 * Show a toast notification.
 * @param {string} type - Toast type: success | error | warning | info
 * @param {string} message - Message text (plain text or simple HTML)
 * @param {object} [opts] - Options
 * @param {number} [opts.duration=4000] - Auto-dismiss ms (0 = no auto-dismiss)
 * @param {boolean} [opts.closable=true] - Show close button
 * @param {string} [opts.position='BR'] - Position code (TL, TC, TR, BL, BC, BR)
 */
const _show = (type, message, opts = {}) => {
	_injectStyles();

	/* deduplicate: skip if an identical toast is already visible */
	const toastKey = `${type}::${message}`;
	if (_activeToasts.has(toastKey)) return;
	_activeToasts.add(toastKey);

	const {
		duration = DEFAULT_DURATION,
		closable = true,
		position = 'BR',
	} = opts;

	const isLight = document.documentElement.dataset.woxTheme === 'light';
	const palette = _getPalette(type);
	const pos = POSITIONS[position] ? position : 'BR';
	const container = _getContainer(pos);

	/* ── build DOM ──────────────── */
	const el = document.createElement('div');
	el.className = `wox-toast wox-toast-${type}`;
	el.style.backgroundColor = palette.bg;
	el.style.borderLeftColor = palette.border;
	el.style.color = palette.text;

	let html = `
		<span class="wox-toast-icon" style="color:${palette.icon}">${ICONS[type] || ICONS.info}</span>
		<span class="wox-toast-message">${message}</span>
	`;

	if (closable) {
		html += `<button class="wox-toast-close" aria-label="Close">&times;</button>`;
	}

	el.innerHTML = html;

	/* ── close button hover colour ── */
	if (closable) {
		const closeBtn = el.querySelector('.wox-toast-close');
		if (closeBtn) {
			closeBtn.addEventListener('mouseenter', () => { closeBtn.style.color = palette.icon; });
			closeBtn.addEventListener('mouseleave', () => { closeBtn.style.color = isLight ? '#999' : '#666'; });
		}
	}

	/* progress bar (only when auto-dismiss is active) */
	let progressEl = null;
	if (duration > 0) {
		progressEl = document.createElement('div');
		progressEl.className = 'wox-toast-progress';
		progressEl.style.backgroundColor = palette.progress;
		progressEl.style.width = '100%';
		el.appendChild(progressEl);
	}

	/* ── animate in ─────────────── */
	const slideFrom = SLIDE_DIR[pos];
	el.animate(
		[
			{ transform: slideFrom, opacity: 0 },
			{ transform: 'translateX(0) translateY(0)', opacity: 1 },
		],
		{ duration: ANIMATION_DURATION, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
	);

	container.appendChild(el);

	/* ── dismiss logic ──────────── */
	let timer = null;
	let remainingMs = duration;
	let startedAt = 0;
	let progressAnim = null;

	/** Start (or resume) the auto-dismiss countdown */
	const _startTimer = () => {
		if (duration <= 0) return;

		startedAt = Date.now();

		/* progress bar animation */
		if (progressEl) {
			progressAnim = progressEl.animate(
				[
					{ width: progressEl.style.width },
					{ width: '0%' },
				],
				{ duration: remainingMs, easing: 'linear', fill: 'forwards' },
			);
		}

		timer = setTimeout(() => _dismiss(), remainingMs);
	};

	/** Pause countdown (on hover) */
	const _pauseTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		if (progressAnim) {
			progressAnim.pause();
		}
		const elapsed = Date.now() - startedAt;
		remainingMs = Math.max(remainingMs - elapsed, 0);
		/* snapshot current progress width so resume starts from here */
		if (progressEl && progressAnim) {
			const pct = duration > 0 ? (remainingMs / duration) * 100 : 0;
			progressEl.style.width = `${pct}%`;
		}
	};

	/** Dismiss a toast with exit animation + collapse */
	const _dismiss = () => {
		_activeToasts.delete(toastKey);
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		if (progressAnim) {
			progressAnim.cancel();
		}

		/* slide out */
		const exit = el.animate(
			[
				{ transform: 'translateX(0) translateY(0)', opacity: 1 },
				{ transform: slideFrom, opacity: 0 },
			],
			{ duration: ANIMATION_DURATION, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
		);

		exit.onfinish = () => {
			/* collapse height so siblings shift smoothly */
			const h = el.offsetHeight;
			el.style.minHeight = '0';
			el.style.padding = '0';
			el.style.margin = '0';
			el.style.overflow = 'hidden';

			const collapse = el.animate(
				[{ height: `${h}px` }, { height: '0px' }],
				{ duration: COLLAPSE_DURATION, easing: 'ease' },
			);
			collapse.onfinish = () => el.remove();
		};
	};

	/* ── event listeners ────────── */
	el.addEventListener('mouseenter', _pauseTimer);
	el.addEventListener('mouseleave', _startTimer);

	if (closable) {
		const closeBtn = el.querySelector('.wox-toast-close');
		if (closeBtn) closeBtn.addEventListener('click', _dismiss);
	}

	/* kick off auto-dismiss */
	_startTimer();
};

/* ── WoxToast class ───────────────────────────────── */

/**
 * <wox-toast> — Toast notification web component.
 *
 * The element itself is a no-render shell. All toast functionality is
 * exposed via static methods:
 *
 *   WoxToast.success('Saved!');
 *   WoxToast.error('Something went wrong');
 *   WoxToast.warning('Careful...', { duration: 6000 });
 *   WoxToast.info('FYI', { position: 'TR', closable: false });
 *
 * @extends WoxElement
 */
class WoxToast extends WoxElement {

	/**
	 * Show a success toast notification.
	 * @param {string} message - Message to display
	 * @param {object} [options] - { duration?: number, closable?: boolean, position?: string }
	 */
	static success = (message, options) => _show('success', message, options);

	/**
	 * Show an error toast notification.
	 * @param {string} message - Message to display
	 * @param {object} [options] - { duration?: number, closable?: boolean, position?: string }
	 */
	static error = (message, options) => _show('error', message, options);

	/**
	 * Show a warning toast notification.
	 * @param {string} message - Message to display
	 * @param {object} [options] - { duration?: number, closable?: boolean, position?: string }
	 */
	static warning = (message, options) => _show('warning', message, options);

	/**
	 * Show an info toast notification.
	 * @param {string} message - Message to display
	 * @param {object} [options] - { duration?: number, closable?: boolean, position?: string }
	 */
	static info = (message, options) => _show('info', message, options);
}

export { WoxToast };
