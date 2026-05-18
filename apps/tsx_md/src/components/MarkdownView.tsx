import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { MarkdownCode } from "@/my_components/monacoEditor";

const markdownComponents = {
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
