import { createFileRoute } from "@tanstack/react-router";
import { MarkdownView } from "@/components/MarkdownView";
import { GithubCorner } from "@/my_components/githubCorner/githubForkIcon";
import { MainNavigationMenu } from "@/my_components/mainNavMenu";

const introMarkdown = `
## Typescript markdown viewer

If you're viewing a Markdown file on GitHub that contains TypeScript, add
\`tsx.md\` before \`github.com\` to render it with TypeScript-aware code blocks.

For example:

[github.com/robolex-app/public_ts/blob/main/README.md](https://github.com/robolex-app/public_ts/blob/main/README.md)

becomes:

[tsx.md/github.com/robolex-app/public_ts/blob/main/README.md](https://tsx.md/github.com/robolex-app/public_ts/blob/main/README.md)

The code renders like this:

\`\`\`ts
import { object, string, number, InferGood, InferBad } from '@robolex/sure'

const schema = object({
  name: string,
  age: number,
})

type Schema = InferGood<typeof schema>
type Issues = InferBad<typeof schema>

const good: Schema = {
  name: 'John',
  age: '99',
}
\`\`\`
`;

function GithubIndexPage() {
  return (
    <div className="relative flex-1">
      <GithubCorner />
      <MainNavigationMenu />

      <main className="mx-auto w-full max-w-3xl px-5 pb-20">
        <article className="prose">
          <MarkdownView markdown={introMarkdown} />
        </article>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/github.com")({
  component: GithubIndexPage,
});
