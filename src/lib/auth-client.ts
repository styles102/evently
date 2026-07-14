import { createAuthClient } from 'better-auth/react'

/**
 * The browser-side better-auth client. Talks to the `/api/auth/$` route;
 * same-origin, so no baseURL needed.
 */
export const authClient = createAuthClient()
