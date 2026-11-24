import { createFileRoute } from "@tanstack/react-router";
import { ProjectIcon } from "@/components/ProjectIcon";
import {
  APPS,
  PRE_AI_TRINKETS,
  TRINKETS,
  type TrinketProject,
} from "@/lib/projects";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

const inlineLinkClassName =
  "text-gray-900 underline decoration-gray-300 underline-offset-[3px] hover:decoration-gray-900";

function TrinketList({ items }: { items: readonly TrinketProject[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {items.map((item) => (
        <li
          key={item.name}
          className="flex items-start justify-between gap-4 text-[14.5px] leading-snug"
        >
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="mt-[2px] flex shrink-0 items-center">
              <ProjectIcon glyph={item.glyph} icon={item.icon} size={16} />
            </span>
            <span className="min-w-0">
              <a
                href={item.url}
                rel="noopener noreferrer"
                target="_blank"
                className={inlineLinkClassName}
              >
                {item.name}
              </a>
              <span className="text-gray-500">: {item.description}</span>
            </span>
          </div>
          <span className="shrink-0 pt-[1px] text-[13px] tabular-nums text-gray-400">
            {item.year}
          </span>
        </li>
      ))}
    </ul>
  );
}

function IndexPage() {
  return (
    <div className="relative flex flex-1 flex-col bg-white">
      <GithubCorner />
      <MainNavigationMenu />

      <main className="mx-auto w-full max-w-[600px] flex-1 px-5 pt-8 pb-16">
        <h1 className="sr-only">tsx.md</h1>

        <section className="space-y-2.5 text-[15px] leading-relaxed text-gray-800">
          <p className="m-0">
            Hi, my name is Nicu. I&apos;m building{" "}
            <a
              href="https://samebase.com"
              rel="noopener noreferrer"
              target="_blank"
              className={inlineLinkClassName}
            >
              samebase.com
            </a>
            , an opinionated way to use{" "}
            <a
              href="https://alchemy.run"
              rel="noopener noreferrer"
              target="_blank"
              className={inlineLinkClassName}
            >
              Alchemy
            </a>
            .
          </p>
          <p className="m-0">
            You can find me on{" "}
            <a
              href="https://x.com/nicu_tsx"
              rel="noopener noreferrer"
              target="_blank"
              className={inlineLinkClassName}
            >
              x.com/nicu_tsx
            </a>
            ,{" "}
            <a
              href="https://github.com/nicu-chiciuc"
              rel="noopener noreferrer"
              target="_blank"
              className={inlineLinkClassName}
            >
              github.com/nicu-chiciuc
            </a>
            , or{" "}
            <a
              href="https://www.linkedin.com/in/chiciuc/"
              rel="noopener noreferrer"
              target="_blank"
              className={inlineLinkClassName}
            >
              linkedin.com/in/chiciuc
            </a>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="m-0 mb-3.5 text-[13px] font-semibold tracking-[0.01em] text-gray-900">
            Apps
          </h2>
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {APPS.map((app) => (
              <li key={app.name} className="flex items-start gap-3">
                <span className="mt-[3px] flex shrink-0 items-center">
                  <ProjectIcon icon={app.icon} size={20} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 text-[15px]">
                    <a
                      href={app.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className={`font-semibold ${inlineLinkClassName}`}
                    >
                      {app.name}
                    </a>
                    <span className="text-[13px] text-gray-500">
                      {app.host}
                    </span>
                  </div>
                  <p className="mt-0.5 mb-0 text-[14px] leading-snug text-gray-600">
                    {app.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gray-900">
            Trinkets
          </h2>
          <p className="mt-1 mb-3.5 text-[13px] text-gray-500">
            Small apps and experiments built recently with coding agents.
          </p>
          <TrinketList items={TRINKETS} />
        </section>

        <section className="mt-10">
          <h2 className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gray-900">
            Pre-AI trinkets
          </h2>
          <p className="mt-1 mb-3.5 text-[13px] text-gray-500">
            Small things I wrote by hand before AI.
          </p>
          <TrinketList items={PRE_AI_TRINKETS} />
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
