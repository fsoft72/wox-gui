import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'wox-gui': resolve(__dirname, 'src/index.js'),
        'register': resolve(__dirname, 'src/register.js'),
        'wox-gui.cdn': resolve(__dirname, 'src/cdn.js'),
      },
      formats: ['es'],
    },
  },
});
