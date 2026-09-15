import path from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/MiniGames/',
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@constants': path.resolve(__dirname, './src/constants'),
      '@types': path.resolve(__dirname, './src/types'),
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@app': path.resolve(__dirname, './src/app'),
      '@state': path.resolve(__dirname, './src/state'),
      '@pages': path.relative(__dirname, './src/pages'),
    },
  },
});
