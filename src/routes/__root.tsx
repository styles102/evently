import type { ReactNode } from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouter,
} from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { getSessionServerFn } from '@/server/auth.fns'
import appCss from '@/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Evently' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  loader: () => getSessionServerFn(),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <SiteHeader />
      <Outlet />
    </RootDocument>
  )
}

function SiteHeader() {
  const session = Route.useLoaderData()
  const router = useRouter()

  const signOut = async () => {
    await authClient.signOut()
    await router.invalidate()
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-8 py-4">
        <Link to="/" className="text-lg font-semibold">
          Evently
        </Link>
        <nav className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Sign in
              </Link>
              <Link to="/sign-up" className={buttonVariants({ size: 'sm' })}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
