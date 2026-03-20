import { resolve } from 'path';
import { defineConfig } from 'vite';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'wox-gui': resolve(__dirname, 'src/index.js'),
        'register': resolve(__dirname, 'src/register.js'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      plugins: [
        terser({
          compress: true,
          mangle: false,
          format: {
            comments: false,
          },
        }),
      ],
    },
  },
});
