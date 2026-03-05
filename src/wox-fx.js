// wox-fx.js — Shared glow and pulse visual effects for WOX components

/**
 * Shared CSS for glow and pulse effects.
 * Requires `--wox-fx-color` to be set on the element with the `.glow` class.
 * Apply `.glow` for neon glow, `.pulse` for opacity pulse, or both combined.
 *
 * Usage in a WOX component:
 *   import { FX_STYLES } from './wox-fx.js';
 *   // Append FX_STYLES to your component's STYLES constant
 *   // Add `glow` / `pulse` classes to the target element
 *   // Set `--wox-fx-color` via inline style on the same element
 */
export const FX_STYLES = `
    /* glow: neon glow effect using --wox-fx-color */
    .glow {
        border-color: var(--wox-fx-color);
        color: var(--wox-fx-color);
        background: color-mix(in srgb, var(--wox-fx-color), transparent 90%);
        box-shadow: 0 0 20px color-mix(in srgb, var(--wox-fx-color), transparent 60%),
                    0 0 40px color-mix(in srgb, var(--wox-fx-color), transparent 85%),
                    inset 0 0 15px color-mix(in srgb, var(--wox-fx-color), transparent 90%);
        animation: wox-glow-pulse 2s ease-in-out infinite alternate;
    }
    .glow svg, .glow .material-icons {
        filter: drop-shadow(0 0 6px var(--wox-fx-color)); opacity: 1;
    }
    .glow span { text-shadow: 0 0 8px var(--wox-fx-color); }
    @keyframes wox-glow-pulse {
        from { box-shadow: 0 0 15px color-mix(in srgb, var(--wox-fx-color), transparent 65%), 0 0 30px color-mix(in srgb, var(--wox-fx-color), transparent 88%), inset 0 0 12px color-mix(in srgb, var(--wox-fx-color), transparent 92%); }
        to   { box-shadow: 0 0 25px color-mix(in srgb, var(--wox-fx-color), transparent 50%), 0 0 50px color-mix(in srgb, var(--wox-fx-color), transparent 80%), inset 0 0 20px color-mix(in srgb, var(--wox-fx-color), transparent 88%); }
    }

    /* pulse: opacity pulse animation */
    .pulse { animation: wox-pulse-fade 1.5s ease-in-out infinite alternate; }
    .glow.pulse { animation: wox-glow-pulse 2s ease-in-out infinite alternate, wox-pulse-fade 1.5s ease-in-out infinite alternate; }
    @keyframes wox-pulse-fade {
        from { opacity: 1; }
        to   { opacity: 0.4; }
    }
`;
