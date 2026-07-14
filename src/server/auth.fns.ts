import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { currentSession } from './auth'

/**
 * Delegate-only server functions — the client-safe face of the auth seam.
 *
 * Imports here are referenced exclusively inside handler bodies, which the
 * TanStack Start compiler extracts server-side; the client bundle receives
 * only RPC stubs, keeping better-auth/pg/dotenv out of the browser.
 */
export const getSessionServerFn = createServerFn({ method: 'GET' }).handler(
  () => currentSession(getRequestHeaders()),
)
