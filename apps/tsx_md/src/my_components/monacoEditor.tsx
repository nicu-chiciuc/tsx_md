import React, { useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { BeforeMount } from '@monaco-editor/react'
import { setupEditorATA, onEditorMount } from './monaco_types/setupEditor'

import Editor from '@monaco-editor/react'

// const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export const MyEditor = (props: {
  lang?: string
  file: string
  defaultValue: string
  projectFiles: { small: string; content: string }[]
}) => {
  const willMount: BeforeMount = monaco => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    })

    props.projectFiles.forEach(file => {
      console.log(file.small)
      monaco.languages.typescript.typescriptDefaults.addExtraLib(file.content, `${file.small}`)
    })
  }

  return (
    <Editor
      language={props.lang}
      options={{
        // hide sidebar
        minimap: { enabled: false },

        // disable scrollbar
        scrollbar: { vertical: 'hidden', horizontal: 'hidden' },

        // disable scrolling
        scrollBeyondLastLine: false,

        wordWrap: 'on',
        wrappingStrategy: 'advanced',

        // disable line numbers
        lineNumbers: 'off',
      }}
      theme="vs-dark"
      // height={'100px'}
      // width={'400px'}
      // width={'600px'}
      defaultLanguage="typescript"
      // beforeMount={willMount}
      defaultPath={props.file}
      path={props.file}
      onMount={onEditorMount}
      defaultValue={props.defaultValue}
    />
  )
}
