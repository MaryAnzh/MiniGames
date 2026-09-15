import path from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/MiniGames/',
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
});
