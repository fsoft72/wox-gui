import { resolve } from 'path';
import { defineConfig } from 'vite';

/**
 * Separate Vite config for the CDN bundle.
 * Produces a single self-contained file with no chunk splitting.
 */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/cdn.js'),
      formats: ['es'],
      fileName: () => 'wox-gui.cdn.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});
