import { createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

const landingMarkdown = `
Hi, my name is Nicu.

I'm currently building [noter.md](https://noter.md).

You can follow me on [x.com/nicu_tsx](https://x.com/nicu_tsx), or if you're feeling formal on [linkedin.com/in/chiciuc](https://www.linkedin.com/in/chiciuc/).
`;

function IndexPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <GithubCorner />
      <div className="tsx-md-landing-nav">
        <MainNavigationMenu />
      </div>

      <main className="flex w-full flex-1 flex-col px-5 pb-20 pt-12">
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

        <section className="mx-auto mt-auto flex w-full max-w-3xl justify-center pt-24">
          <h1 className="tsx-md-wordmark">tsx.md</h1>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
