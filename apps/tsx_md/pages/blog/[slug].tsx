import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import path from 'path'
import fs from 'fs/promises'
import { MarkdownComponentsMonaco } from '@/my_components/monacoEditor'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { GithubIcon } from '@/my_components/githubCorner/githubForkIcon'
import { MAIN_REPO } from '@/constants'

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

  const mdxText = await fs.readFile(projectPath, 'utf8')

  const mdxSerialized = await serialize(mdxText)

  return {
    props: {
      fileName,
      // mdxText,
      mdxSerialized,
    },
  }
}
export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const link = `${MAIN_REPO}/blob/main/apps/tsx_md/articles/${props.fileName}.md`

  return (
    <div className="flex flex-col items-center">
      <GithubIcon href={link} />
      <MainNavigationMenu />

      <div className="flex items-center justify-center ">
        <div className="prose lg:prose-xl">
          <MDXRemote {...props.mdxSerialized} components={MarkdownComponentsMonaco} />
        </div>
      </div>
    </div>
  )
}
