import { expect, test, waitForHydration } from './fixtures'

test('home page shows the seeded Categories', async ({ page }) => {
  await page.goto('/')
  await waitForHydration(page)

  await expect(
    page.getByRole('heading', { name: 'Evently' }),
  ).toBeVisible()

  const categoryList = page.getByRole('list', { name: 'Categories' })
  for (const name of ['Music', 'Tech', 'Sports', 'Food', 'Arts', 'Business']) {
    await expect(categoryList.getByText(name, { exact: true })).toBeVisible()
  }
})
