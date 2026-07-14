import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema'

/**
 * The category-list seam: reads all Categories from Postgres, ordered by name.
 * Integration tests call this directly; the app calls it through
 * `listCategoriesServerFn`.
 */
export async function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.name))
}

export const listCategoriesServerFn = createServerFn({ method: 'GET' }).handler(
  () => listCategories(),
)
