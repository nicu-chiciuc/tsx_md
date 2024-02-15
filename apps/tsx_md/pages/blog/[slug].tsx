import type { InferGetStaticPropsType, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { GithubIcon } from '@/my_components/githubCorner/githubForkIcon'
import { MAIN_REPO } from '@/constants'
import { MarkdownComponentsMonaco } from '@/my_components/monacoEditor'
import { getArticle, getArticles } from '@/server/blogServing'
import Giscus from '@giscus/react'

export const getStaticPaths = (async () => {
  const frontmatters = await getArticles()

  return {
    paths: frontmatters.map(file => {
      return {
        params: {
          slug: file.name,
        },
      }
    }),
    fallback: false, // false or "blocking"
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context: GetStaticPropsContext<{ slug?: string }>) => {
  const fileName = context.params?.slug

  if (!fileName) {
    throw new Error('fileName is undefined')
  }

  const article = await getArticle(fileName)

  return {
    props: {
      fileName,
      mdxSerialized: article.mdxSerialized,
    },
  }
}) satisfies GetStaticProps

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const link = `${MAIN_REPO}/blob/main/apps/tsx_md/articles/${props.fileName}.md`

  /**
   * When commenting locally, I don't want to spam the main repo with comments.
   */
  const ghMapping =
    process.env['NODE_ENV'] === 'production'
      ? ({
          mapping: 'pathname',
        } as const)
      : ({
          mapping: 'specific',
          term: 'dev: trying giscus',
        } as const)

  return (
    <div className="flex w-full flex-col items-center ">
      <GithubIcon href={link} />
      <MainNavigationMenu />

      <main className="w-full p-5">
        <article className="prose mx-auto mb-14 break-words">
          <MDXRemote {...props.mdxSerialized} components={MarkdownComponentsMonaco} />
        </article>

        <div className="mx-auto max-w-prose">
          <Giscus
            id="comments"
            repo="nicu-chiciuc/tsx_md"
            repoId="R_kgDOLMhPTQ"
            category="Announcements"
            categoryId="DIC_kwDOLMhPTc4CdQTT"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="preferred_color_scheme"
            lang="en"
            loading="lazy"
            {...ghMapping}
          />
        </div>
      </main>
    </div>
  )
}
