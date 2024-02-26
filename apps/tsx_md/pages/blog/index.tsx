import { InferGetStaticPropsType } from 'next'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { GithubCorner } from '@/my_components/githubCorner/githubForkIcon'
import Link from 'next/link'
import { getArticles } from '@/server/blogServing'

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { knownFiles } = props

  return (
    <div className="container flex flex-col items-center overflow-hidden">
      <GithubCorner />
      <MainNavigationMenu />

      <div className="flex items-center justify-center ">
        <article className="prose lg:prose-xl">
          <h1>Blog</h1>
          <ul>
            {knownFiles.map(file => (
              // nicely formated links using tailwind
              <li key={file.name}>
                <Link href={`/blog/${file.name}`} className="text-blue-900 hover:underline">
                  {file.fm.title}
                </Link>

                <p>{file.fm.description}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const frontmatters = await getArticles()

  return {
    props: {
      knownFiles: frontmatters,
    },
  }
}
