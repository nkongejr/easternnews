import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Mirror the tsconfig `@/*` path alias used across the app.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    // Component tests only — the pure engine suite runs on `node --test`.
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
