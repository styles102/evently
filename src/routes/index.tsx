import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { listCategoriesServerFn } from '@/server/categories.fns'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => listCategoriesServerFn(),
})

function Home() {
  const categories = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Evently</h1>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Browse events by Category — every Event has exactly one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2" aria-label="Categories">
            {categories.map((category) => (
              <li key={category.id}>
                <Badge variant="secondary">{category.name}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}
