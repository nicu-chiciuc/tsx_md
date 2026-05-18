import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { MarkdownCode } from "@/my_components/monacoEditor";

const markdownComponents = {
  pre({ children }) {
    // MarkdownCode owns fenced-code block wrappers so Monaco can render valid div markup.
    return <>{children}</>;
  },
  code({ children, className }) {
    return <MarkdownCode className={className}>{children}</MarkdownCode>;
  },
} satisfies Components;

export function MarkdownView({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      components={markdownComponents}
      rehypePlugins={[rehypeSanitize]}
      remarkPlugins={[remarkGfm]}
    >
      {markdown}
    </ReactMarkdown>
  );
}
