import { afterAll, describe, expect, it } from 'vitest'
import { listCategories } from '@/server/categories'
import { db } from '@/db'

afterAll(async () => {
  await db.$client.end()
})

describe('listCategories', () => {
  it('returns the fixed seeded Category list, ordered by name', async () => {
    const categories = await listCategories()

    expect(categories.map((category) => category.name)).toEqual([
      'Arts',
      'Business',
      'Food',
      'Music',
      'Sports',
      'Tech',
    ])
  })

  it('returns Categories with ids so callers can reference them', async () => {
    const categories = await listCategories()

    for (const category of categories) {
      expect(category.id).toEqual(expect.any(Number))
    }
  })
})
