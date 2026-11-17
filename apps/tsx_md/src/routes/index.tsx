import { createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { HomeSponge } from "@/components/HomeSponge";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

const landingMarkdown = `
Hi, my name is Nicu.

I'm currently building [samebase.com](https://samebase.com), an opinionated way to use [Alchemy](https://alchemy.run).

You can follow me on [x.com/nicu_tsx](https://x.com/nicu_tsx),

or if you're feeling formal on [linkedin.com/in/chiciuc](https://www.linkedin.com/in/chiciuc/)

or if you're feeling technical on [github.com/nicu-chiciuc](https://github.com/nicu-chiciuc)
`;

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

        <section className="relative mx-auto min-h-80 w-full max-w-3xl flex-1">
          <h1 className="sr-only">tsx.md</h1>
          {/* Absolute so the container has a definite height for cqh. */}
          <div className="absolute inset-x-0 inset-y-6 flex items-center justify-center @container-size">
            <div className="size-[min(100cqw,100cqh,40rem)]">
              <HomeSponge />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
