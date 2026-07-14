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
import { validateEmail } from '@/lib/auth-validation'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      setServerError(null)
      const { error } = await authClient.signIn.email(value)
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
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Welcome back to Evently.</CardDescription>
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
                name="email"
                validators={{ onSubmit: ({ value }) => validateEmail(value) }}
              >
                {(field) => <TextField field={field} label="Email" type="email" />}
              </form.Field>
              <form.Field
                name="password"
                validators={{
                  onSubmit: ({ value }) =>
                    value ? undefined : 'Password is required',
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
                    Sign in
                  </Button>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            New to Evently?{' '}
            <Link
              to="/sign-up"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
