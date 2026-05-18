import { useLocation } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MAIN_REPO } from "@/constants";
import { MarkdownView } from "@/components/MarkdownView";
import { parseGithubMarkdownPath } from "@/lib/githubMarkdown";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

type RemoteMarkdownState =
  | {
      kind: "idle";
    }
  | {
      kind: "loading";
      displayPath: string;
    }
  | {
      kind: "loaded";
      displayPath: string;
      markdown: string;
    }
  | {
      kind: "error";
      message: string;
    };

function GithubFilePage() {
  const location = useLocation();
  const target = useMemo(
    () => parseGithubMarkdownPath(location.pathname),
    [location.pathname],
  );
  const [state, setState] = useState<RemoteMarkdownState>({ kind: "idle" });
  const link = `${MAIN_REPO}/blob/main/apps/tsx_md/src/routes/github-file.tsx`;

  useEffect(() => {
    if (target.kind === "invalid") {
      setState({ kind: "error", message: "Invalid GitHub Markdown URL." });
      return;
    }

    const controller = new AbortController();
    setState({ kind: "loading", displayPath: target.displayPath });

    fetch(target.sourceUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`GitHub returned ${response.status}.`);
        }
        const markdown = await response.text();
        setState({
          kind: "loaded",
          displayPath: target.displayPath,
          markdown,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          kind: "error",
          message: error instanceof Error ? error.message : "Could not load Markdown.",
        });
      });

    return () => controller.abort();
  }, [target]);

  return (
    <div className="relative min-h-screen">
      <GithubCorner href={link} />
      <MainNavigationMenu />

      <main className="w-full px-5 pb-20">
        <article className="prose mx-auto mb-14 break-words">
          {state.kind === "idle" || state.kind === "loading" ? (
            <p>Loading {state.kind === "loading" ? state.displayPath : "Markdown"}...</p>
          ) : null}

          {state.kind === "error" ? <p>{state.message}</p> : null}

          {state.kind === "loaded" ? (
            <>
              <p className="text-sm text-gray-500">{state.displayPath}</p>
              <MarkdownView markdown={state.markdown} />
            </>
          ) : null}
        </article>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/github.com/$owner/$repo/blob/$branch/$")({
  component: GithubFilePage,
});
