import { createServerFn } from '@tanstack/react-start'
import { listCategories } from './categories'

/**
 * Delegate-only server functions — the client-safe face of the Category seam.
 *
 * Imports here are referenced exclusively inside handler bodies, which the
 * TanStack Start compiler extracts server-side; the client bundle receives
 * only RPC stubs, keeping drizzle/pg/dotenv out of the browser.
 */
export const listCategoriesServerFn = createServerFn({ method: 'GET' }).handler(
  () => listCategories(),
)
