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

describe('sign-in', () => {
  it('signs in an existing user with the correct credentials', async () => {
    await auth.api.signUpEmail({
      body: {
        name: 'Bob',
        email: emailFor('bob'),
        password: 'a perfectly fine password',
      },
    })

    const result = await auth.api.signInEmail({
      body: {
        email: emailFor('bob'),
        password: 'a perfectly fine password',
      },
    })

    expect(result.user.email).toBe(emailFor('bob'))
    expect(result.token).toBeTruthy()
  })

  it('refuses the wrong password with a clear message', async () => {
    await auth.api.signUpEmail({
      body: {
        name: 'Carol',
        email: emailFor('carol'),
        password: 'the real password',
      },
    })

    const attempt = auth.api.signInEmail({
      body: {
        email: emailFor('carol'),
        password: 'not the real password',
      },
    })

    await expect(attempt).rejects.toMatchObject({
      statusCode: 401,
      body: { message: 'Invalid email or password' },
    })
  })
})

describe('duplicate email', () => {
  it('refuses a second sign-up with an already-registered email', async () => {
    const body = {
      name: 'Dave',
      email: emailFor('dave'),
      password: 'daves excellent password',
    }
    await auth.api.signUpEmail({ body })

    const attempt = auth.api.signUpEmail({
      body: { ...body, name: 'Dave Impostor' },
    })

    await expect(attempt).rejects.toMatchObject({
      statusCode: 422,
      body: { message: expect.stringMatching(/already exists/i) },
    })
  })
})
