import { Editor, EditorProps } from '@monaco-editor/react'
import { createATA } from './ata'
import { JsxEmit } from 'typescript'

export const typeHelper = createATA()

export const onEditorMount: EditorProps['onMount'] = (editor, monaco) => {
  setupEditorATA(editor, monaco)

  const updateHeight = () => {
    const container = editor.getDomNode()
    if (!container) return

    const contentHeight = Math.min(1000, editor.getContentHeight())

    container.style.height = `${contentHeight}px`
  }
  editor.onDidContentSizeChange(updateHeight)
  updateHeight()
}

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

    // console.log('added library to runtime', path)

    // don't need to open the file in the editor
    // const uri = monaco.Uri.file(path);
    // if (monaco.editor.getModel(uri) === null) {
    //   monaco.editor.createModel(code, 'javascript', uri);
    // }
  }

  typeHelper.addListener('receivedFile', addLibraryToRuntime)

  typeHelper.acquireType(editor.getValue())

  // auto adjust the height fits the content
  const element = editor.getDomNode()
  const height = editor.getScrollHeight()
  if (element) {
    element.style.height = `${height}px`
  }
}
