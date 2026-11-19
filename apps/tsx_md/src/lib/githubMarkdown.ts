import type { VersionPin } from "@/my_components/monaco_types/typeLoader";

export type GithubMarkdownTarget =
  | {
      kind: "invalid";
    }
  | {
      kind: "valid";
      displayPath: string;
      sourceUrl: string;
      typePin: VersionPin | undefined;
    };

/**
Versioned docs keep a `v3` folder in their path. On those pages the project's
own packages, named like the owner or repository, load at that major version:
`Effect-TS/website/.../docs/v3/...` loads `effect@3` and `@effect/*@3`.
*/
function versionPin(
  owner: string,
  repo: string,
  filePath: ReadonlyArray<string>,
): VersionPin | undefined {
  const major = filePath
    .map((segment) => /^v(\d+)$/.exec(segment)?.[1])
    .find((value) => value !== undefined);
  if (major === undefined) return undefined;
  const words = [owner, repo]
    .flatMap((part) => part.toLowerCase().split(/[^a-z0-9]+/))
    .filter((word) => word.length > 2);
  return { major, names: words.flatMap((word) => [word, `@${word}/`]) };
}

function decodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function parseGithubMarkdownPath(
  pathname: string,
): GithubMarkdownTarget {
  const prefix = "/github.com/";
  if (!pathname.startsWith(prefix)) {
    return { kind: "invalid" };
  }

  const segments = pathname
    .slice(prefix.length)
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) => decodePathSegment(segment));

  if (segments[2] === "blob") {
    segments.splice(2, 1);
  }

  if (segments.length < 4) {
    return { kind: "invalid" };
  }

  const [owner, repo, branch, ...filePath] = segments;
  if (!owner || !repo || !branch || filePath.length === 0) {
    return { kind: "invalid" };
  }

  const rawPath = [owner, repo, branch, ...filePath]
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return {
    kind: "valid",
    displayPath: segments.join("/"),
    sourceUrl: `https://raw.githubusercontent.com/${rawPath}`,
    typePin: versionPin(owner, repo, filePath),
  };
}
