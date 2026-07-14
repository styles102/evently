import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema'

/**
 * The category-list seam: reads all Categories from Postgres, ordered by name.
 * Integration tests call this directly; the app calls it through
 * `listCategoriesServerFn` (see `categories.fns.ts`).
 *
 * This module imports server-only code (the db pool), so route files must
 * never import it directly — only via the `*.fns.ts` delegates, whose handler
 * bodies are stripped from the client bundle.
 */
export async function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.name))
}
