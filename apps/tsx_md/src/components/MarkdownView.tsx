import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { MarkdownCode, TypePinContext } from "@/my_components/monacoEditor";
import type { VersionPin } from "@/my_components/monaco_types/typeLoader";

const markdownComponents = {
  pre({ children }) {
    // MarkdownCode owns fenced-code block wrappers so Monaco can render valid div markup.
    return <>{children}</>;
  },
  code({ children, className }) {
    return <MarkdownCode className={className}>{children}</MarkdownCode>;
  },
} satisfies Components;

export function MarkdownView({
  markdown,
  typePin,
}: {
  markdown: string;
  typePin?: VersionPin | undefined;
}) {
  return (
    <TypePinContext value={typePin}>
      <ReactMarkdown
        components={markdownComponents}
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </TypePinContext>
  );
}
