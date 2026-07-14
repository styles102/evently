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
 * Refusal raised by session-required seams. Carries `status: 401` so the
 * server-function wrappers that expose seams over RPC can map it to a real
 * 401 response instead of a generic 500.
 */
export class UnauthorizedError extends Error {
  readonly status = 401

  constructor(message = 'You must be signed in to do that') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

/**
 * The session-required seam: guards operations that only signed-in users may
 * perform. Refuses anonymous callers; returns the signed-in user otherwise.
 */
export async function requireUser(headers: Headers) {
  const session = await currentSession(headers)
  if (!session) {
    throw new UnauthorizedError()
  }
  return session.user
}

export type SessionUser = { id: string; name: string; email: string }

/**
 * The client-safe session shape. The root loader dehydrates its result into
 * every page's HTML, so only what the UI needs may cross this seam — never
 * the raw better-auth session (token, ipAddress, userAgent).
 */
export async function publicSession(
  headers: Headers,
): Promise<{ user: SessionUser } | null> {
  const session = await currentSession(headers)
  if (!session) return null
  const { id, name, email } = session.user
  return { user: { id, name, email } }
}
