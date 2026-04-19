import { Link, createFileRoute } from '@tanstack/solid-router'

import { Button } from '../components/ui/button'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main class="grid min-h-dvh place-items-center">
      <Button as={Link} to="/">
        Home
      </Button>
    </main>
  )
}
