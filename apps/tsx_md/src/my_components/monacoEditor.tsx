import React, { useEffect, useMemo } from 'react'
import Editor, { useMonaco, BeforeMount } from '@monaco-editor/react'
// import * as monaco from 'monaco-editor'

export const MyEditor = (props: { defaultValue: string }) => {
  // const monaco = useMonaco()

  const willMount: BeforeMount = monaco => {
    // Configuration for TypeScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ES2015,
      allowJs: true,
    })

    // Adding custom type definitions
    const libSource = `
                declare module 'myModule' {
                    export function myFunction(): void;
                }
            `
    const libUri = 'ts:filename/myModule.d.ts'
    monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource, libUri)

    // You can add as many extra libs as you want, e.g., for other modules

    // Ensure to adjust paths and module resolution as per your project structure
  }

  // useEffect(() => {
  //   if (monaco) {
  //     // Configuration for TypeScript
  //     monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  //       noLib: true,
  //       allowNonTsExtensions: true,
  //       target: monaco.languages.typescript.ScriptTarget.ES2015,
  //       moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  //       module: monaco.languages.typescript.ModuleKind.ES2015,
  //       allowJs: true,
  //     })

  //     // Adding custom type definitions
  //     const libSource = `
  //               declare module 'myModule' {
  //                   export function myFunction(): void;
  //               }
  //           `
  //     const libUri = 'ts:filename/myModule.d.ts'
  //     monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource, libUri)

  //     // You can add as many extra libs as you want, e.g., for other modules

  //     // Ensure to adjust paths and module resolution as per your project structure
  //   }
  // }, [])

  return (
    <Editor
      height="90vh"
      defaultLanguage="typescript"
      beforeMount={willMount}
      defaultValue={`
import { myFunction } from 'myModule'

const myVar = myFunction()

console.log(myVar)
    `}

      // {...props}
    />
  )
}
