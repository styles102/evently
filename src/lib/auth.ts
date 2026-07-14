import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '@/db'
import * as schema from '@/db/schema'

/**
 * The better-auth server instance. Email/password only — no OAuth, no email
 * verification. Sessions are cookie-based; the Drizzle adapter owns the auth
 * tables (user, session, account, verification) in Postgres.
 *
 * `auth.api.*` is directly callable and is the seam the integration tests use.
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET ?? 'evently-dev-only-secret-change-me',
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: {
    enabled: true,
  },
  // Must stay the last plugin: sets auth cookies when auth.api.* is called
  // from inside TanStack Start server functions.
  plugins: [tanstackStartCookies()],
})
