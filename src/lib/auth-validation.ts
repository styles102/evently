/**
 * Field validation rules for the auth forms. Each returns an error message,
 * or `undefined` when the value is acceptable — the shape TanStack Form's
 * field validators expect.
 */

/** Matches better-auth's default minimum password length. */
export const MIN_PASSWORD_LENGTH = 8

export function validateName(value: string): string | undefined {
  return value.trim() ? undefined : 'Name is required'
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email is required'
  return /^\S+@\S+\.\S+$/.test(value)
    ? undefined
    : 'Enter a valid email address'
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required'
  return value.length >= MIN_PASSWORD_LENGTH
    ? undefined
    : `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
}
