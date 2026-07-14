import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Integration tests hit real Postgres and do real password hashing;
    // the 5s default flakes on cold starts.
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
})
