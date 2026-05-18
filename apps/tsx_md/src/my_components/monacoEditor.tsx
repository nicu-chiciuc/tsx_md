import { ClientOnly } from "@tanstack/react-router";
import React from "react";
import { onEditorMount } from "./monaco_types/setupEditor";

import Editor from "@monaco-editor/react";

const monacoLanguages = new Set(["ts", "tsx", "typescript"]);

function CodeFallback(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return <code className={props.className}>{props.children}</code>;
}

/**
Renders TypeScript code fences with Monaco so article examples keep hoverable
types without making every Markdown language pay the editor cost.
*/
export function MarkdownCode(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const editorId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "-");
  const match = /language-(\w+)/.exec(props.className || "");
  const language = match?.[1];

  if (!language || !monacoLanguages.has(language)) {
    return <code className={props.className}>{props.children}</code>;
  }

  const source = `\n${String(props.children).replace(/\n$/, "")}\n`;

  return (
    <div className="not-prose my-5">
      <ClientOnly
        fallback={
          <CodeFallback className={props.className}>
            {props.children}
          </CodeFallback>
        }
      >
        <MyEditor
          defaultValue={source}
          file={`markdown-${editorId}.tsx`}
          lang="typescript"
          projectFiles={[]}
        />
      </ClientOnly>
    </div>
  );
}

export const MyEditor = (props: {
  lang?: string;
  file: string;
  defaultValue: string;
  projectFiles: { small: string; content: string }[];
}) => {
  return (
    <Editor
      language={props.lang}
      options={{
        // hide sidebar
        minimap: { enabled: false },

        // disable scrollbar
        // scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
        //
        scrollbar: {
          // handleMouseWheel: false,

          // So that it's possible to scroll down the page, when the mouse is over the editor
          alwaysConsumeMouseWheel: false,
        },

        // disable scrolling
        scrollBeyondLastLine: false,

        // wordWrap: 'on',
        // wrappingStrategy: 'advanced',

        // disable line numbers
        lineNumbers: "off",
      }}
      theme="vs-dark"
      // height={'100px'}
      // width={'400px'}
      // width={editorWidth}
      defaultLanguage="typescript"
      // beforeMount={willMount}
      defaultPath={props.file}
      path={props.file}
      onMount={onEditorMount}
      defaultValue={props.defaultValue}
    />
  );
};
