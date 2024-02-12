import { InferGetStaticPropsType } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { GithubIcon } from '@/my_components/githubCorner/githubForkIcon'
import { serialize } from 'next-mdx-remote/serialize'
import { assertArticleFrontmatter } from '@/my_components/frontmatter'
import Link from 'next/link'

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { knownFiles } = props

  return (
    <div className="container flex flex-col items-center overflow-hidden">
      <GithubIcon />
      <MainNavigationMenu />

      <div className="flex items-center justify-center ">
        <article className="prose lg:prose-xl">
          <h1>Blog</h1>
          <ul>
            {knownFiles.map(file => (
              // nicely formated links using tailwind
              <li key={file.name}>
                <Link href={`/blog/${file.name}`} className="text-blue-900 hover:underline">
                  {file.title}
                </Link>

                <p>{file.description}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const projectPath = path.join(process.cwd(), 'articles')
  const files = await fs.readdir(projectPath)

  // parse frontmatter from all files
  const frontmatters = await Promise.all(
    files.map(async file => {
      const mdxText = await fs.readFile(path.join(projectPath, file), 'utf8')

      const mdxSerialized = await serialize(mdxText, {
        parseFrontmatter: true,
      })

      const valid = assertArticleFrontmatter(mdxSerialized.frontmatter)

      const [name, extension] = file.split('.')

      return { ...valid, name, extension }
    })
  )

  return {
    props: {
      knownFiles: frontmatters,
    },
  }
}
