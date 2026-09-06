import { createFileRoute } from "@tanstack/react-router";
import type { PointerEvent as ReactPointerEvent } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

const landingMarkdown = `
Hi, my name is Nicu.

I'm currently building [noter.md](https://noter.md).

You can follow me on [x.com/nicu_tsx](https://x.com/nicu_tsx),

or if you're feeling formal on [linkedin.com/in/chiciuc](https://www.linkedin.com/in/chiciuc/)

or if you're feeling technical on [github.com/nicu-chiciuc](https://github.com/nicu-chiciuc)
`;

const wordmarkMaxRotation = 14;

function handleWordmarkPointerMove(event: ReactPointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  event.currentTarget.style.setProperty(
    "--tsx-md-wordmark-rotate-x",
    `${(-y * wordmarkMaxRotation).toFixed(2)}deg`,
  );
  event.currentTarget.style.setProperty(
    "--tsx-md-wordmark-rotate-y",
    `${(x * wordmarkMaxRotation).toFixed(2)}deg`,
  );
}

function resetWordmarkPointer(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--tsx-md-wordmark-rotate-x", "0deg");
  event.currentTarget.style.setProperty("--tsx-md-wordmark-rotate-y", "0deg");
}

function IndexPage() {
  return (
    <div className="relative flex flex-1 flex-col bg-white">
      <GithubCorner />
      <MainNavigationMenu />

      <main className="flex w-full flex-1 flex-col px-5 pt-12">
        <section className="mx-auto w-full max-w-3xl">
          <div className="prose">
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize]}
              remarkPlugins={[remarkGfm]}
            >
              {landingMarkdown}
            </ReactMarkdown>
          </div>
        </section>

        <section
          className="tsx-md-wordmark-stage mx-auto flex w-full max-w-3xl flex-1 items-center justify-center"
          onPointerLeave={resetWordmarkPointer}
          onPointerMove={handleWordmarkPointerMove}
        >
          <h1 className="tsx-md-wordmark">tsx.md</h1>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
