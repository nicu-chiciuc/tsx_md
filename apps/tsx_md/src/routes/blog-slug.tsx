import Giscus from "@giscus/react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MAIN_REPO } from "@/constants";
import { MarkdownView } from "@/components/MarkdownView";
import { getPublishedArticle } from "@/lib/articles";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

function BlogArticlePage() {
  const article = Route.useLoaderData();
  const sourceLink = `${MAIN_REPO}/blob/main/apps/tsx_md/articles/${article.slug}.md`;
  const giscusMapping = import.meta.env.PROD
    ? { mapping: "pathname" as const }
    : { mapping: "specific" as const, term: "dev: trying giscus" };

  return (
    <div className="relative min-h-screen">
      <GithubCorner href={sourceLink} />
      <MainNavigationMenu />

      <main className="w-full px-5 pb-20">
        <article className="prose mx-auto mb-14 break-words">
          <h1 className="text-5xl font-bold text-gray-700">{article.title}</h1>
          <MarkdownView markdown={article.markdown} />
        </article>

        <div className="mx-auto max-w-prose">
          <Giscus
            id="comments"
            repo="nicu-chiciuc/tsx_md"
            repoId="R_kgDOLMhPTQ"
            category="Announcements"
            categoryId="DIC_kwDOLMhPTc4CdQTT"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="preferred_color_scheme"
            lang="en"
            loading="lazy"
            {...giscusMapping}
          />
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/blog/$slug")({
  component: BlogArticlePage,
  loader: ({ params }) => {
    const article = getPublishedArticle(params.slug);
    if (!article) {
      throw notFound();
    }
    return article;
  },
});
