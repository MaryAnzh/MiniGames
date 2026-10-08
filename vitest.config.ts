import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig({
  ...viteConfig,
  resolve: {
    ...viteConfig.resolve,
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        // ❌ SCSS files contain only styling, no JavaScript logic
        'src/**/*.scss',

        // ❌ Constants contain static values only, no executable logic
        'src/constants/**/*.ts',
        'src/**/constants.ts',

        // ❌ Type declarations contain no runtime logic
        'src/types/**/*.ts',
        'src/**/types.ts',

        // ❌ main.ts is a bootstrap file with no business logic
        'src/main.ts',

        // ❌ index.ts files contain only re‑exports, no application logic
        'src/**/index.ts',
      ],
    },
  },
});
