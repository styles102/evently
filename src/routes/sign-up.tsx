import { useState } from 'react'
import {
  Link,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldError, FieldGroup } from '@/components/ui/field'
import { TextField } from '@/components/text-field'
import { authClient } from '@/lib/auth-client'
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/lib/auth-validation'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { name: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      setServerError(null)
      const { error } = await authClient.signUp.email(value)
      if (error) {
        setServerError(error.message ?? 'Something went wrong — try again.')
        return
      }
      await router.invalidate()
      await navigate({ to: '/' })
    },
  })

  return (
    <main className="mx-auto max-w-sm p-8">
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create your Evently account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                validators={{ onSubmit: ({ value }) => validateName(value) }}
              >
                {(field) => <TextField field={field} label="Name" />}
              </form.Field>
              <form.Field
                name="email"
                validators={{ onSubmit: ({ value }) => validateEmail(value) }}
              >
                {(field) => <TextField field={field} label="Email" type="email" />}
              </form.Field>
              <form.Field
                name="password"
                validators={{
                  onSubmit: ({ value }) => validatePassword(value),
                }}
              >
                {(field) => (
                  <TextField field={field} label="Password" type="password" />
                )}
              </form.Field>
              {serverError && <FieldError>{serverError}</FieldError>}
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button type="submit" disabled={isSubmitting}>
                    Sign up
                  </Button>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
