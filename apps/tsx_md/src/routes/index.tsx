import { createFileRoute } from "@tanstack/react-router";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

function IndexPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <GithubCorner />
      <MainNavigationMenu />

      <main className="flex w-full flex-1 items-center justify-center px-6 pb-24">
        <h1 className="tsx-md-wordmark">tsx.md</h1>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
