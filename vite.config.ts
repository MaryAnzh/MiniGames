import path from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export default defineConfig({
  base: '/',
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@constants': path.resolve(__dirname, './src/constants'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.relative(__dirname, './src/utils'),
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@route': path.resolve(__dirname, './src/route'),
      '@app': path.resolve(__dirname, './src/app'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store/store'),
      '@pages': path.relative(__dirname, './src/pages'),
    },
  },
  optimizeDeps: {
    exclude: ['web-vitals'],
  },
});
