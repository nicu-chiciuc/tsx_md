import { Editor, EditorProps } from '@monaco-editor/react'
import { createATA } from './ata'
import { JsxEmit } from 'typescript'
import type { Monaco } from '@monaco-editor/react'

export const typeHelper = createATA()

// Register the receivedFile listener once globally (not per editor).
// All editors share the same typescriptDefaults, so a single listener is sufficient.
// Registering per editor caused N × addExtraLib calls per file, each triggering
// a full re-validation of all models, which caused visible flickering.
let ataListenerRegistered = false

function ensureATAListener(monaco: Monaco) {
  if (ataListenerRegistered) return
  ataListenerRegistered = true

  const defaults = monaco.languages.typescript.typescriptDefaults

  typeHelper.addListener('receivedFile', (code: string, _path: string) => {
    const path = 'file://' + _path
    defaults.addExtraLib(code, path)
  })
}

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
  const defaults = monaco.languages.typescript.typescriptDefaults

  defaults.setCompilerOptions({
    jsx: JsxEmit.React,
    esModuleInterop: true,

    strict: true,
    exactOptionalPropertyTypes: true,
  })

  // Register the global ATA listener (idempotent, only runs once)
  ensureATAListener(monaco)

  // acquireType on content change
  editor.onDidChangeModelContent(() => {
    typeHelper.acquireType(editor.getValue())
  })

  typeHelper.acquireType(editor.getValue())

  // auto adjust the height fits the content
  const element = editor.getDomNode()
  const height = editor.getScrollHeight()
  if (element) {
    element.style.height = `${height}px`
  }
}
