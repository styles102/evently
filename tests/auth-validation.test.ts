import { describe, expect, it } from 'vitest'
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/lib/auth-validation'

describe('validateName', () => {
  it('accepts a non-empty name', () => {
    expect(validateName('Alice')).toBeUndefined()
  })

  it('rejects blank names', () => {
    expect(validateName('   ')).toMatch(/name/i)
  })
})

describe('validateEmail', () => {
  it('accepts a well-formed email', () => {
    expect(validateEmail('alice@example.com')).toBeUndefined()
  })

  it('rejects a blank email', () => {
    expect(validateEmail('')).toMatch(/email/i)
  })

  it('rejects a malformed email', () => {
    expect(validateEmail('not-an-email')).toMatch(/valid email/i)
  })
})

describe('validatePassword', () => {
  it('accepts a password of at least 8 characters', () => {
    expect(validatePassword('12345678')).toBeUndefined()
  })

  it('rejects a blank password', () => {
    expect(validatePassword('')).toMatch(/password/i)
  })

  it('rejects a password shorter than 8 characters', () => {
    expect(validatePassword('1234567')).toMatch(/8 characters/i)
  })
})
