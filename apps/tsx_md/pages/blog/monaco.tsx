import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react'

export default function MonacoPage() {
  return (
    <div>
      <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />
    </div>
  )
}
