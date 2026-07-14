import type { AnyFieldApi } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

/**
 * A labelled text input bound to a TanStack Form field, with the field's
 * validation errors rendered underneath.
 */
export function TextField({
  field,
  label,
  type = 'text',
}: {
  field: AnyFieldApi
  label: string
  type?: 'text' | 'email' | 'password'
}) {
  return (
    <Field data-invalid={!field.state.meta.isValid || undefined}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      <FieldError>{field.state.meta.errors.join(', ') || null}</FieldError>
    </Field>
  )
}
