import { serialize } from 'next-mdx-remote/serialize'
// import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import Md from 'react-markdown'
import path from 'path'
import fs from 'fs/promises'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

interface Props {
  mdxSource: string
}

export default function RemoteMdxPage({ mdxSource }: Props) {
  console.log(mdxSource)

  return (
    // more margin on top and bottom
    <div className="m-9 flex items-center justify-center">
      <div className="prose lg:prose-xl">
        <Md
          components={{
            code(props) {
              const { children, className, ...rest } = props

              const match = /language-(\w+)/.exec(className || '')

              return match ? (
                // @ts-expect-error TODO fix
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  language={match[1]}
                  // style={dark}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            },
          }}
        >
          {mdxSource}
        </Md>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const projectPath = path.join(process.cwd(), 'src/articles/sure_lib.mdx')
  const mdxText = await fs.readFile(projectPath, 'utf8')

  console.log(mdxText)

  // const mdxSource = await serialize(mdxText)

  return { props: { mdxSource: mdxText } }
}
