import { createFileRoute } from "@tanstack/react-router";

function IndexPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <a href="https://noter.md">https://noter.md</a>
    </main>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
