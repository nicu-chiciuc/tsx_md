import { GetStaticProps, InferGetStaticPropsType } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { notEmpty } from '@robolex/dependent'

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { knownFiles } = props

  return (
    // A beatiful blog page using tailwind
    <div className="flex items-center justify-center ">
      {/* links to all the blogs */}
      <div className="prose lg:prose-xl">
        <h1>Blog</h1>
        <ul>
          {knownFiles.map(file => (
            // nicely formated links using tailwind
            <li key={file}>
              <a href={`/blog/${file}`}>{file}</a>
            </li>
          ))}
        </ul>
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
