import Md from 'react-markdown'
import path from 'path'
import fs from 'fs/promises'
import { MarkdownComponentsMonaco } from '@/my_components/monacoEditor'

interface Props {
  mdxSource: string
}

export default function RemoteMdxPage({ mdxSource }: Props) {
  return (
    // more margin on top and bottom
    <div className="m-9 flex items-center justify-center">
      <div className={'prose lg:prose-l'}>
        <Md components={MarkdownComponentsMonaco}>{mdxSource}</Md>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const projectPath = path.join(process.cwd(), 'articles/sure_lib.mdx')
  const mdxText = await fs.readFile(projectPath, 'utf8')

  // const mdxSource = await serialize(mdxText)

  return { props: { mdxSource: mdxText } }
}
