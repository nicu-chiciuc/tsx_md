import { Link, createFileRoute } from "@tanstack/react-router";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";
import { getPublishedArticles } from "@/lib/articles";

function BlogIndexPage() {
  const articles = Route.useLoaderData();

  return (
    <div className="relative flex-1">
      <GithubCorner />
      <MainNavigationMenu />

      <main className="mx-auto w-full max-w-3xl px-5 pb-20">
        <section className="prose">
          <h1>Blog</h1>
          <ul>
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: article.slug }}
                  className="text-blue-900 hover:underline"
                >
                  {article.title}
                </Link>
                <p>{article.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/blog")({
  component: BlogIndexPage,
  loader: () => getPublishedArticles(),
});
