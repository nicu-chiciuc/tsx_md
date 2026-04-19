import { Link, createFileRoute } from '@tanstack/solid-router'

import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main class="grid min-h-dvh place-items-center">
      <Button as={Link} to="/about">
        About
      </Button>
    </main>
  )
}
