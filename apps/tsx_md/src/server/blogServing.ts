import path from 'path'
import fs from 'fs/promises'
import { assertArticleFrontmatter } from '@/my_components/frontmatter'
import { serialize } from 'next-mdx-remote/serialize'
import { mapAll } from '@robolex/dependent'

const filesToIgnore = ['.prettierrc']
const BLOG_FOLDER = 'articles'

export async function getArticle(nameWithExtension: string) {
  const filesInfo = await getArticles()

  const article = filesInfo.find(file => file.name === nameWithExtension)

  if (!article) {
    throw new Error(`article is undefined for file "${nameWithExtension}"`)
  }

  return article
}

export async function getArticles() {
  const projectPath = path.join(process.cwd(), BLOG_FOLDER)

  const allFiles = await fs.readdir(projectPath)

  const files = allFiles.filter(file => !filesToIgnore.includes(file))

  const fileInfos = await mapAll(files, async file => {
    const mdxText = await fs.readFile(path.join(projectPath, file), 'utf8')

    const mdxSerialized = await serialize(mdxText, {
      parseFrontmatter: true,
    })

    const frontmatter = assertArticleFrontmatter(mdxSerialized.frontmatter)

    const [name, ...extensions] = file.split('.')

    if (!name) {
      throw new Error(`name is empty for file "${file}"`)
    }

    const extension = extensions.join('.')

    return { fm: frontmatter, name, extension, mdxSerialized }
  })

  return fileInfos
}
