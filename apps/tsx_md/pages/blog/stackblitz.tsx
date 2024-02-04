import sdk from '@stackblitz/sdk'
import { useEffect, useRef } from 'react'

const FILE_divId = 'myDiv'
const FILE_ghSlug = 'nicu-chiciuc/stackblitz-starters-5fj1s6'

function createEmbedGithub() {
  return sdk.embedGithubProject(FILE_divId, FILE_ghSlug, {
    openFile: 'src/index.js',
    hideDevTools: true,
  })
}

function createEmbedProject({ embedId, divId, codeSource }: { divId: string; embedId: string; codeSource: string }) {
  return sdk.embedProject(
    divId,

    {
      files: {
        'index.ts': codeSource,
        'package.json': JSON.stringify({
          type: 'module',
          dependencies: {
            '@robolex/sure': '0.9.5',
          },
        }),
      },
      title: embedId,
      description: `ArkType ${embedId} demo`,
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
    }
  )
}

export const EditCode = (props: { divId: string; codeSource: string }) => {
  useEffect(() => {
    createEmbedProject({
      embedId: 'something',

      ...props,
    })
  }, [])

  return <div id={FILE_divId} />
}

export default function Page() {
  const sourceCode = `
import { good } from '@robolex/sure'

const myVar = good(34)
`

  return (
    <div className="flex h-screen items-center justify-center ">
      <EditCode divId={FILE_divId} codeSource={sourceCode} />
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
