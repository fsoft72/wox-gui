import { resolve } from 'path';
import { defineConfig } from 'vite';

/**
 * Vite config for building the GitHub Pages site.
 * Outputs to dist-site/ with base path /wox-gui/.
 */
export default defineConfig({
    root: 'site',
    base: '/wox-gui/',
    build: {
        outDir: resolve(__dirname, 'dist-site'),
        emptyOutDir: true,
    },
});
