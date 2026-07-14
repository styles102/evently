import { expect, test, type Page } from '@playwright/test'

/**
 * TanStack Start streams SSR markup, then hydrates. Clicks that land before
 * hydration hit handler-less DOM and silently do nothing, so wait for Start's
 * hydration marker (`$_TSR` is deleted once hydration completes) after every
 * full page load.
 */
async function waitForHydration(page: Page) {
  await page.waitForFunction(() => !('$_TSR' in window))
}

test('a visitor can sign up, stay signed in across a reload, and sign out', async ({
  page,
}) => {
  const email = `pat-${Date.now()}@example.test`

  await page.goto('/')
  await waitForHydration(page)

  // Anonymous: header offers sign-in and sign-up.
  const header = page.getByRole('banner')
  await expect(header.getByRole('link', { name: 'Sign in' })).toBeVisible()
  await header.getByRole('link', { name: 'Sign up' }).click()

  // Sign up through the real form.
  await page.getByLabel('Name').fill('Pat')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('a very fine password')
  await page.getByRole('button', { name: 'Sign up' }).click()

  // Signed in: header shows the user's name.
  await expect(header.getByText('Pat')).toBeVisible()
  await expect(header.getByRole('link', { name: 'Sign in' })).toBeHidden()

  // Session persists across a reload.
  await page.reload()
  await waitForHydration(page)
  await expect(header.getByText('Pat')).toBeVisible()

  // Sign out: header returns to anonymous links.
  await header.getByRole('button', { name: 'Sign out' }).click()
  await expect(header.getByRole('link', { name: 'Sign in' })).toBeVisible()
  await expect(header.getByText('Pat')).toBeHidden()
})
