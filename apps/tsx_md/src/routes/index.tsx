import { createFileRoute } from "@tanstack/react-router";
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

function IndexPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
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

        <section className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center">
          <h1 className="tsx-md-wordmark">tsx.md</h1>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
