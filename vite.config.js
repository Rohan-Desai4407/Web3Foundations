import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        concepts: resolve(__dirname, 'concepts.html'),
        prices: resolve(__dirname, 'prices.html'),
        simulator: resolve(__dirname, 'simulator.html'),
      },
    },
  },
});
