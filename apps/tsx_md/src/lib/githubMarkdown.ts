export type GithubMarkdownTarget =
  | {
      kind: "invalid";
    }
  | {
      kind: "valid";
      displayPath: string;
      sourceUrl: string;
    };

function decodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function parseGithubMarkdownPath(pathname: string): GithubMarkdownTarget {
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
  };
}
