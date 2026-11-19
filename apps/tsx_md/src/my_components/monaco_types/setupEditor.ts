import type { Monaco, OnMount } from "@monaco-editor/react";
import { createTypeLoader, type VersionPin } from "./typeLoader";

type TypeLoader = ReturnType<typeof createTypeLoader>;

// All editors share one `typescriptDefaults`, so one loader per pin feeds it.
// The loader of the most recently mounted editor owns the extra libs.
const loaders = new Map<string, TypeLoader>();
let activeKey: string | undefined;

// TypeScript's `ModuleResolutionKind.Bundler`; Monaco's enum stops at NodeJs.
const bundlerResolution: number = 100;

function setLibs(monaco: Monaco, files: ReadonlyMap<string, string>) {
  monaco.languages.typescript.typescriptDefaults.setExtraLibs(
    [...files].map(([path, content]) => ({
      filePath: `file://${path}`,
      content,
    })),
  );
}

function typeLoaderFor(monaco: Monaco, pin: VersionPin | undefined) {
  const key = pin ? `${pin.major}:${pin.names.join(",")}` : "";
  let loader = loaders.get(key);
  if (!loader) {
    loader = createTypeLoader({
      pin,
      onFiles: (files) => {
        if (activeKey === key) setLibs(monaco, files);
      },
    });
    loaders.set(key, loader);
  }
  if (activeKey !== key) {
    activeKey = key;
    setLibs(monaco, loader.files);
  }
  return loader;
}

export function editorMount(pin: VersionPin | undefined): OnMount {
  return (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: bundlerResolution,
      esModuleInterop: true,
      allowNonTsExtensions: true,

      strict: true,
      exactOptionalPropertyTypes: true,
    });

    const loader = typeLoaderFor(monaco, pin);
    loader.load(editor.getValue());

    // Wait for a pause in typing so half-typed imports are not looked up.
    let typing: ReturnType<typeof setTimeout> | undefined;
    editor.onDidChangeModelContent(() => {
      clearTimeout(typing);
      typing = setTimeout(() => loader.load(editor.getValue()), 750);
    });

    const updateHeight = () => {
      const container = editor.getDomNode();
      if (!container) return;

      const contentHeight = Math.min(1000, editor.getContentHeight());

      container.style.height = `${contentHeight}px`;
    };
    editor.onDidContentSizeChange(updateHeight);
    updateHeight();
  };
}
