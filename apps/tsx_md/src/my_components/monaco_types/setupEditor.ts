import { Editor } from '@monaco-editor/react'
import { createATA } from './ata'
import { JsxEmit } from 'typescript'

export const typeHelper = createATA()

export const setupEditorATA: NonNullable<React.ComponentProps<typeof Editor>['onMount']> = (editor, monaco) => {
  // acquireType on initial load
  editor.onDidChangeModelContent(() => {
    typeHelper.acquireType(editor.getValue())
  })

  const defaults = monaco.languages.typescript.typescriptDefaults

  defaults.setCompilerOptions({
    jsx: JsxEmit.React,
    esModuleInterop: true,
  })

  const addLibraryToRuntime = (code: string, _path: string) => {
    const path = 'file://' + _path
    defaults.addExtraLib(code, path)

    console.log('added library to runtime', path)

    // don't need to open the file in the editor
    // const uri = monaco.Uri.file(path);
    // if (monaco.editor.getModel(uri) === null) {
    //   monaco.editor.createModel(code, 'javascript', uri);
    // }
  }

  typeHelper.addListener('receivedFile', addLibraryToRuntime)

  typeHelper.acquireType(`
import { good } from '@robolex/sure'

const myVar = good(34)

console.log(myVar)
  `)

  // auto adjust the height fits the content
  const element = editor.getDomNode()
  const height = editor.getScrollHeight()
  if (element) {
    element.style.height = `${height}px`
  }
}
