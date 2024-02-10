import { GetStaticProps, InferGetStaticPropsType } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { notEmpty } from '@robolex/dependent'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { knownFiles } = props

  return (
    <div className="flex flex-col items-center">
      <MainNavigationMenu />

      <div className="flex items-center justify-center ">
        <article className="prose lg:prose-xl">
          <h1>Blog</h1>
          <ul>
            {knownFiles.map(file => (
              // nicely formated links using tailwind
              <li key={file}>
                <a href={`/blog/${file}`}>{file}</a>
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

  const withoutExtension = files.map(file => file.split('.')[0]).filter(notEmpty)

  return {
    props: {
      knownFiles: withoutExtension,
    },
  }
}
