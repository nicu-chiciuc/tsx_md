import React, { useEffect, useMemo } from 'react'
import Editor, { useMonaco, BeforeMount } from '@monaco-editor/react'
// import * as monaco from 'monaco-editor'

export const MyEditor = (props: { defaultValue: string; projectFiles: { path: string; content: string }[] }) => {
  // const monaco = useMonaco()

  const willMount: BeforeMount = monaco => {
    // Configuration for TypeScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      baseUrl: 'file://', // This should match the prefix used in your file URIs
      paths: {
        '@robolex/sure': ['file:///node_modules/@robolex/sure/*'],

        // Add paths mapping here if your imports are not directly to the file paths
      },
    })

    // monaco.languages.typescript.typescriptDefaults.addExtraLib(

    props.projectFiles.forEach(file => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(file.content, `file:///${file.path}`)
    })
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage="typescript"
      beforeMount={willMount}
      defaultValue={`
import { good } from '@robolex/sure'

const myVar = good(34)

console.log(myVar)
    `}

      // {...props}
    />
  )
}
