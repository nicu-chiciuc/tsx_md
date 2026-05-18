import { Link, createFileRoute } from "@tanstack/react-router";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";
import { getPublishedArticles } from "@/lib/articles";

const myApps = [
  {
    description:
      "Simple weight tracker that allows text-based import/export of data.",
    favicon: "https://weight.tsx.md/favicon.png",
    name: "Weight Tracker",
    url: "https://weight.tsx.md",
  },
  {
    description:
      "Chess game inspired by Chess Plus, but with slightly different rules.",
    favicon: "https://chessmerge.com/bishop_horse.svg",
    name: "Chess Merge",
    url: "https://chessmerge.com",
  },
  {
    description:
      "If Notion and Obsidian had a baby. (real-time collaborative git worktree)",
    favicon: "https://noter.md/logo-static.svg",
    name: "WorkFir",
    url: "https://noter.md",
  },
];

function BlogIndexPage() {
  const articles = Route.useLoaderData();

  return (
    <div className="relative min-h-screen">
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

        <section className="mt-20">
          <h1 className="text-2xl font-semibold text-gray-900">Apps</h1>
          <div className="mt-5 flex flex-col gap-4">
            {myApps.map((app) => (
              <a
                key={app.name}
                href={app.url}
                rel="noopener noreferrer"
                target="_blank"
                className="border border-gray-200 p-4 no-underline hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={app.favicon}
                    alt={`${app.name} favicon`}
                    width={64}
                    height={64}
                  />
                  <div>
                    <div className="text-lg font-medium text-gray-900">
                      {app.url.replace("https://", "")}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {app.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/blog")({
  component: BlogIndexPage,
  loader: () => getPublishedArticles(),
});
