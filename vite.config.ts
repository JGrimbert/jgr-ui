import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      'lolve':       path.resolve(process.cwd(), '../lolve'),
      'jgr-maestra': path.resolve(process.cwd(), '../jgr-maestra'),
      // Alias interne de lolve : @/foo → lolve/src/foo
      '@':           path.resolve(process.cwd(), '../lolve/src'),
    },
  },
});
