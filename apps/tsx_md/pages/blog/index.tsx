import { InferGetStaticPropsType } from 'next'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { GithubCorner } from '@/my_components/githubCorner/githubForkIcon'
import Link from 'next/link'
import { getArticles } from '@/server/blogServing'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// Types for apps
interface App {
  name: string
  url: string
  description: string
  favicon: string
}

// Favicon component with manual URLs
function AppFavicon({ favicon, name }: { favicon: string; name: string }) {
  return <img src={favicon} alt={`${name} favicon`} width={64} height={64} className="rounded" />
}

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { knownFiles } = props

  // My external apps
  const myApps: App[] = [
    {
      name: 'Weight Tracker',
      url: 'https://weight.tsx.md',
      description: 'Simple weight tracker that allows text-based import/export of data.',
      favicon: 'https://weight.tsx.md/favicon.png',
    },
    {
      name: 'Chess Merge',
      url: 'https://chessmerge.com',
      description: 'Chess game inspired by Chess Plus, but with slightly different rules.',
      favicon: 'https://chessmerge.com/bishop_horse.svg',
    },
    {
      name: 'WorkFir',
      url: 'https://noter.md',
      description: 'If Notion and Obsidian had a baby. (real-time collaborative git worktree)',
      favicon: 'https://noter.md/favicon.svg',
    },
  ]

  return (
    <div className="container flex flex-col items-center overflow-hidden">
      <GithubCorner />
      <MainNavigationMenu />

      <div className="prose lg:prose-xl">
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

        {/* more spacing here */}
        <div className="h-28" />

        {/* Apps Section */}
        <h1 className="mt-16">Apps</h1>
        <div className="not-prose flex flex-col gap-4">
          {myApps.map(app => (
            <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer">
              <Card className="w-full cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-4">
                    <AppFavicon favicon={app.favicon} name={app.name} />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{app.url.replace('https://', '')}</CardTitle>
                      <CardDescription className="mt-1">{app.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const frontmatters = await getArticles()

  // Filter out draft articles from the list
  const publishedArticles = frontmatters.filter(article => article.fm.status !== 'draft')

  return {
    props: {
      knownFiles: publishedArticles,
    },
  }
}
