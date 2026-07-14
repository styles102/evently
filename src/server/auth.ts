import { auth } from '@/lib/auth'

/**
 * The session-read seam: resolves the better-auth session (or null) from
 * request headers. Integration tests call this directly; the app calls it
 * through `getSessionServerFn` (see `auth.fns.ts`).
 *
 * This module imports server-only code (better-auth, the db pool), so route
 * files must never import it directly — only via the `*.fns.ts` delegates,
 * whose handler bodies are stripped from the client bundle.
 */
export async function currentSession(headers: Headers) {
  return auth.api.getSession({ headers })
}

/**
 * The session-required seam: guards operations that only signed-in users may
 * perform. Refuses anonymous callers; returns the signed-in user otherwise.
 */
export async function requireUser(headers: Headers) {
  const session = await currentSession(headers)
  if (!session) {
    throw new Error('You must be signed in to do that')
  }
  return session.user
}
