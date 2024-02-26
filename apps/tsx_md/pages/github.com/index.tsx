import { InferGetStaticPropsType } from 'next'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { GithubCorner } from '@/my_components/githubCorner/githubForkIcon'
import Link from 'next/link'
import { getArticles } from '@/server/blogServing'

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="container flex flex-col items-center overflow-hidden">
      <GithubCorner />
      <MainNavigationMenu />

      <div className="flex items-center justify-center ">
        <article className="prose lg:prose-xl">
          <h2>Typescript markdown viewer</h2>

          <p>
            If you're viewing some markdown file on github that contains Typescript: for example
            [https://github.com/robolex-app/public_ts/blob/main/README.md]
          </p>
        </article>
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  return {
    props: {},
  }
}
