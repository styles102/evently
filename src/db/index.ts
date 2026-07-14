import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

// .env is a server-side concern. This module must never execute in the
// browser (routes only import the `*.fns.ts` delegates), but guard the
// side-effectful dotenv import anyway so an accidental client import fails
// loudly in pg rather than mysteriously in dotenv. `typeof window` (not
// import.meta.env.SSR) so plain-node runners like tsx and vitest work too.
if (typeof window === 'undefined') {
  await import('dotenv/config')
}

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://evently:evently@localhost:5432/evently'

export const db = drizzle(connectionString, { schema })
