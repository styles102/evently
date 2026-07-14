import { afterAll, describe, expect, it } from 'vitest'
import { like } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { user } from '@/db/schema'

/**
 * Auth seam tests run against the real Postgres from docker-compose.
 * Emails are unique per run; created users (and their sessions/accounts,
 * via FK cascade) are removed afterwards.
 */
const runId = crypto.randomUUID().slice(0, 8)
const emailFor = (name: string) => `${name}-${runId}@example.test`

afterAll(async () => {
  await db.delete(user).where(like(user.email, `%-${runId}@example.test`))
  await db.$client.end()
})

describe('sign-up', () => {
  it('creates an account with email and password and signs the user in', async () => {
    const result = await auth.api.signUpEmail({
      body: {
        name: 'Alice',
        email: emailFor('alice'),
        password: 'correct horse battery staple',
      },
    })

    expect(result.user.email).toBe(emailFor('alice'))
    expect(result.user.name).toBe('Alice')
    expect(result.token).toBeTruthy()
  })
})
