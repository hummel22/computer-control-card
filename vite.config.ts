import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/computer-control-card.ts',
      formats: ['es'],
      fileName: () => 'computer-control-card.js',
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true,
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: 'dist',
  },
});
