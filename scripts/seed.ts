import 'dotenv/config'
import { db } from '../src/db'
import { categories } from '../src/db/schema'

const CATEGORY_NAMES = ['Music', 'Tech', 'Sports', 'Food', 'Arts', 'Business']

await db
  .insert(categories)
  .values(CATEGORY_NAMES.map((name) => ({ name })))
  .onConflictDoNothing()

console.log(`Seeded categories: ${CATEGORY_NAMES.join(', ')}`)

await db.$client.end()
