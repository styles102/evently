import { expect, test, waitForHydration } from './fixtures'

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

  // The session cookie is persistent (survives a browser restart), not a
  // session cookie that dies with the process.
  const cookies = await page.context().cookies()
  const sessionCookie = cookies.find((c) => c.name.includes('session_token'))
  expect(sessionCookie, 'persistent session cookie is set').toBeDefined()
  expect(sessionCookie!.expires).toBeGreaterThan(
    Date.now() / 1000 + 6 * 24 * 60 * 60,
  )

  // Session persists across a reload.
  await page.reload()
  await waitForHydration(page)
  await expect(header.getByText('Pat')).toBeVisible()

  // Sign out: header returns to anonymous links.
  await header.getByRole('button', { name: 'Sign out' }).click()
  await expect(header.getByRole('link', { name: 'Sign in' })).toBeVisible()
  await expect(header.getByText('Pat')).toBeHidden()
})
