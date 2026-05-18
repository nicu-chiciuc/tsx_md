import { createFileRoute } from "@tanstack/react-router";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

const landingLinks = {
  linkedin: "https://www.linkedin.com/in/chiciuc/",
  noter: "https://noter.md",
  x: "https://x.com/nicu_tsx",
} as const;

function IndexPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <GithubCorner />
      <MainNavigationMenu />

      <main className="w-full px-5 pb-20 pt-12">
        <section className="mx-auto w-full max-w-3xl">
          <h1 className="tsx-md-wordmark">tsx.md</h1>
          <div className="prose mt-12">
            <p>Hi, my name is Nicu.</p>
            <p>
              I&apos;m currently building{" "}
              <a href={landingLinks.noter}>noter.md</a>.
            </p>
            <p>
              You can follow me on <a href={landingLinks.x}>x.com/nicu_tsx</a>,
              or if you&apos;re feeling formal on{" "}
              <a href={landingLinks.linkedin}>linkedin.com/in/chiciuc</a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
