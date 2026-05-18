import { parse } from "yaml";

const articleFiles = import.meta.glob<string>("../../articles/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

export type ArticleStatus = "draft" | "published";

export interface Article {
  description: string;
  markdown: string;
  slug: string;
  status: ArticleStatus;
  title: string;
}

interface ArticleFrontmatter {
  description: string;
  status: ArticleStatus;
  title: string;
}

function readStringField(data: object, key: string): string {
  const value = Reflect.get(data, key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Article frontmatter field "${key}" must be a string.`);
  }
  return value;
}

function readStatusField(data: object): ArticleStatus {
  const value = Reflect.get(data, "status");
  if (value === undefined) {
    return "published";
  }
  if (value === "draft" || value === "published") {
    return value;
  }
  throw new Error(
    'Article frontmatter field "status" must be "draft" or "published".',
  );
}

function readFrontmatter(data: unknown): ArticleFrontmatter {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Article frontmatter must be an object.");
  }

  return {
    description: readStringField(data, "description"),
    status: readStatusField(data),
    title: readStringField(data, "title"),
  };
}

function splitMarkdownFile(markdown: string): {
  body: string;
  frontmatter: ArticleFrontmatter;
} {
  if (!markdown.startsWith("---\n")) {
    throw new Error("Article is missing YAML frontmatter.");
  }

  const end = markdown.indexOf("\n---", 4);
  if (end < 0) {
    throw new Error("Article frontmatter is not closed.");
  }

  const frontmatterText = markdown.slice(4, end);
  const parsedFrontmatter: unknown = parse(frontmatterText);
  const body = markdown.slice(end + "\n---".length).replace(/^\s+/, "");

  return {
    body,
    frontmatter: readFrontmatter(parsedFrontmatter),
  };
}

function slugFromPath(path: string): string {
  const file = path.split("/").at(-1);
  if (!file || !file.endsWith(".md")) {
    throw new Error(`Unsupported article path: ${path}`);
  }

  return file.slice(0, -".md".length);
}

const articles = Object.entries(articleFiles)
  .map(([path, markdown]) => {
    const { body, frontmatter } = splitMarkdownFile(markdown);
    return {
      description: frontmatter.description,
      markdown: body,
      slug: slugFromPath(path),
      status: frontmatter.status,
      title: frontmatter.title,
    };
  })
  .sort((left, right) => {
    const byTitle = left.title.localeCompare(right.title);
    return byTitle || left.slug.localeCompare(right.slug);
  });

export function getPublishedArticles(): Article[] {
  return articles.filter((article) => article.status !== "draft");
}

export function getPublishedArticle(slug: string): Article | null {
  return (
    getPublishedArticles().find((article) => article.slug === slug) ?? null
  );
}
