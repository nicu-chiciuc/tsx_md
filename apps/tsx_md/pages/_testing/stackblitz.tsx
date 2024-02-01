import sdk from '@stackblitz/sdk'
import { useEffect, useRef } from 'react'
import { arrayOf } from '@robolex/dependent'

const FILE_ghSlug = 'nicu-chiciuc/stackblitz-starters-5fj1s6'

async function createEmbedProject({
  embedId,
  divId,
  codeSource,
}: {
  divId: string
  embedId: string
  codeSource: string
}) {
  const depsOptions = {
    dependencies: {
      '@robolex/sure': '0.9.5',
    },
  }

  const vm = await sdk.embedProject(
    divId,

    {
      files: {
        'index.ts': codeSource,
        'package.json': JSON.stringify({
          type: 'module',
          ...depsOptions,
        }),
      },
      title: embedId,
      description: `ArkType ${embedId} demo`,

      // https://blog.stackblitz.com/posts/announcing-native-package-manager-support/
      // The EngineBlock is using Turbo, so it's deprecated
      // and has issue installing @robolex/sure
      template: 'node',

      settings: {
        compile: {
          clearConsole: false,
          trigger: 'keystroke',
        },
      },
    },

    {
      openFile: 'index.ts',
      view: 'editor',
      showSidebar: false,

      // hide activity bar
      hideExplorer: true,

      // hide tab bar
      hideNavigation: true,

      hideDevTools: true,

      terminalHeight: 0,
    }
  )

  // close terminal
  const editor = vm.editor

  // editor.
}

export const EditCode = (props: { divId: string; codeSource: string }) => {
  useEffect(() => {
    createEmbedProject({
      embedId: 'something',

      ...props,
    })
  }, [])

  return <div id={props.divId} />
}

export default function Page() {
  const sourceCode = `
import { good } from '@robolex/sure'

const myVar = good(34)
`

  return (
    // fle downwards
    // <div className="flex flex-col items-center justify-center h-screen ">
    <div className="flex h-screen flex-col items-center justify-center ">
      {arrayOf(10, null).map((_, i) => {
        console.log({
          i,
        })

        return <EditCode key={i} divId={`div_id_${i}`} codeSource={sourceCode} />
      })}
    </div>
  )
}

export async function getStaticProps() {
  // Read the whole github project
  // and create the project with stackblitz manually

  const files = ['.gitignore', '.prettierrc.json', 'index.js', 'package-lock.json', 'package.json', 'README.md']

  const url = 'https://raw.githubusercontent.com/' + FILE_ghSlug + '/main/index.js'
  // const result = await fetch(url)
  // const text = await result.text()

  return { props: {} }
}
