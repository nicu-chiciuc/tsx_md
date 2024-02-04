import sdk from '@stackblitz/sdk'
import { useEffect, useRef } from 'react'

const divId = 'myDiv'
const ghSlug = 'nicu-chiciuc/stackblitz-starters-5fj1s6'

function createEmbedGithub() {
  return sdk.embedGithubProject(divId, ghSlug, {
    openFile: 'src/index.js',
    hideDevTools: true,
  })
}

function createEmbedProject() {
  const embedId = 'my-embed-id'

  return sdk.embedProject(
    divId,

    {
      files: {
        'index.js': 'console.log("Hello, world!")',
      },
      title: embedId,
      description: `ArkType ${embedId} demo`,
      template: 'typescript',
      dependencies: {
        '@robolex/sure': '0.8.0',
      },
      settings: {
        compile: {
          clearConsole: false,
          trigger: 'keystroke',
        },
      },
    }
  )
}

export default function Page() {
  useEffect(() => {
    createEmbedProject()
  }, [])

  return (
    <div className="flex h-screen items-center justify-center ">
      <div id={divId} />
    </div>
  )
}

export async function getStaticProps() {
  // Read the whole github project
  // and create the project with stackblitz manually

  const files = ['.gitignore', '.prettierrc.json', 'index.js', 'package-lock.json', 'package.json', 'README.md']

  const url = 'https://raw.githubusercontent.com/' + ghSlug + '/main/index.js'
  // const result = await fetch(url)
  // const text = await result.text()

  return { props: {} }
}
