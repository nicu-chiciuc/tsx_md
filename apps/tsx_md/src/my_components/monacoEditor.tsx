import React, { useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { BeforeMount } from '@monaco-editor/react'

import Editor from '@monaco-editor/react'

// const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export const MyEditor = (props: { defaultValue: string; projectFiles: { small: string; content: string }[] }) => {
  // const monaco = useMonaco()

  const willMount: BeforeMount = monaco => {
    // Configuration for TypeScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      // baseUrl: 'file://', // This should match the prefix used in your file URIs
      // paths: {
      //   '@robolex/sure': ['file:///node_modules/@robolex/sure/*'],

      //   // Add paths mapping here if your imports are not directly to the file paths
      // },
    })

    // monaco.languages.typescript.typescriptDefaults.addExtraLib(
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(file.content, `@robolex/sure`)

    // @robolex/sure

    const mainFileName = 'node_modules/@robolex/sure/src/index.ts'

    const mainFile = props.projectFiles.find(file => file.small === mainFileName)
    if (!mainFile) throw new Error('Could not find main file.')

    monaco.languages.typescript.typescriptDefaults.addExtraLib(mainFile.content, '@robolex/sure')

    props.projectFiles.forEach(file => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(file.content, `${file.small}`)
    })

    const libs = monaco.languages.typescript.typescriptDefaults.getExtraLibs()

    console.log(libs)
  }

  return (
    <Editor
      height="90vh"
      width={'600px'}
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
