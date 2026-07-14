import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'

/**
 * Routes may reach the server layer only through the `*.fns.ts` delegates.
 * Importing a seam module (or the db / better-auth instance) directly from a
 * route keeps the server import graph alive in the client bundle and crashes
 * hydration on every page — invisibly, unless an e2e test happens to interact
 * post-hydration. See docs/adr/0002.
 */
const ROUTES_DIR = join(import.meta.dirname, '../src/routes')

const SERVER_ONLY = [
  /\/server\/(?!.*\.fns$)/, // '@/server/x' or '../server/x' — anything not a .fns delegate
  /^@\/db(\/|$)/,
  /^@\/lib\/auth$/,
]

// API route files (`api.*`) declare only `server.handlers`, which the Start
// compiler strips from the client bundle the same way it strips serverFn
// handler bodies — verified empirically in PR #15: all pages hydrate clean
// with api.auth.$.ts importing the better-auth instance.
const SERVER_ROUTE = /^api\./

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.(ts|tsx)$/.test(entry.name) &&
        !SERVER_ROUTE.test(entry.name),
    )
    .map((entry) => join(entry.parentPath, entry.name))
}

test('route files import the server layer only via *.fns delegates', () => {
  const offenders: string[] = []

  for (const file of sourceFiles(ROUTES_DIR)) {
    const source = readFileSync(file, 'utf-8')
    for (const match of source.matchAll(
      /(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g,
    )) {
      const specifier = match[1]
      if (SERVER_ONLY.some((pattern) => pattern.test(specifier))) {
        offenders.push(`${file} -> ${specifier}`)
      }
    }
  }

  expect(offenders).toEqual([])
})
