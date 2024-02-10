import React from 'react'
import type { BeforeMount } from '@monaco-editor/react'
import { editorWidth, onEditorMount } from './monaco_types/setupEditor'
import type { MDXRemoteProps } from 'next-mdx-remote'

import Editor from '@monaco-editor/react'

// Increase when a new editor is created
// This is used to give a unique file name to the editor
// Otherwise repeats the content in the editors.
//
// TOOD: Reasearch and check if this is the correct way to do it
let EditorId = 0

/**
To be used by the <Md /> component in the react-markdown components prop
or by the <MDXRemote /> component in the components prop

Configures the usage of monaco editor in the markdown
*/
export const MarkdownComponentsMonaco: MDXRemoteProps['components'] = {
  code(props) {
    const { children, className, ...rest } = props

    const match = /language-(\w+)/.exec(className || '')

    if (!match) {
      return (
        // make it beautiful with tw, just little bolder and add the backticks back
        <code {...rest} className={className + ' '}>
          {children}
        </code>
      )
    }

    const source = '\n' + String(children).replace(/\n$/, '') + '\n'

    return (
      <div
        // make the code sit in the middle
        className="flex items-center justify-center"
      >
        <MyEditor defaultValue={source} file={`file${EditorId++}.ts`} projectFiles={[]} />
      </div>
    )
  },
}

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
      width={editorWidth}
      defaultLanguage="typescript"
      // beforeMount={willMount}
      defaultPath={props.file}
      path={props.file}
      onMount={onEditorMount}
      defaultValue={props.defaultValue}
    />
  )
}
