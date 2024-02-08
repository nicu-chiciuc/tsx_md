import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'
import Md from 'react-markdown'
import path from 'path'
import fs from 'fs/promises'

type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticPaths = (async () => {
  // read all files from ./posts

  const projectPath = path.join(process.cwd(), 'articles')

  const files = await fs.readdir(projectPath)

  const withoutExtension = files.map(file => file.split('.')[0])

  return {
    paths: [
      ...files.map(file => {
        const withoutExtension = file.split('.')[0]

        return {
          params: {
            slug: withoutExtension,
          },
        }
      }),
    ],
    fallback: false, // false or "blocking"
  }
}) satisfies GetStaticPaths

export const getStaticProps = async (context: any) => {
  const fileName = context.params?.slug as string

  const projectPath = path.join(process.cwd(), 'articles', `${fileName}.md`)
  console.log(projectPath)
  const mdxText = await fs.readFile(projectPath, 'utf8')

  return {
    props: {
      fileName,
      mdxText,
    },
  }
}
export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="flex items-center justify-center ">
      <div className="prose lg:prose-xl">
        <Md>{props.mdxText}</Md>
      </div>
    </div>
  )
}
