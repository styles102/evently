import { test as base, expect, type Page } from '@playwright/test'

/**
 * TanStack Start streams SSR markup, then hydrates. Clicks that land before
 * hydration hit handler-less DOM and silently do nothing, so wait for Start's
 * hydration marker after every full page load. `$_TSR` is a private Start
 * internal (deleted once hydration completes) — if a framework upgrade breaks
 * this wait, replace it with an app-owned marker.
 */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => !('$_TSR' in window))
}

/**
 * Every test fails if the page throws an uncaught error. A hydration crash
 * otherwise leaves a server-rendered page that still passes visibility
 * assertions — the exact blind spot that hid the slice-1 server-import leak.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const pageErrors: Error[] = []
    page.on('pageerror', (error) => pageErrors.push(error))
    await use(page)
    expect(
      pageErrors.map((error) => error.message),
      'page threw uncaught errors',
    ).toEqual([])
  },
})

export { expect }
