import { serialize } from 'next-mdx-remote/serialize'
// import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import Md from 'react-markdown'
import path from 'path'
import fs from 'fs/promises'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useRef } from 'react'
import { MyEditor } from '@/my_components/monacoEditor'

interface Props {
  mdxSource: string
}

export default function RemoteMdxPage({ mdxSource }: Props) {
  console.log(mdxSource)
  const codeRef = useRef(0)

  return (
    // more margin on top and bottom
    <div className="m-9 flex items-center justify-center">
      <div className={'prose lg:prose-l'}>
        <Md
          components={{
            code(props) {
              console.log(props)
              const { children, className, ...rest } = props

              const match = /language-(\w+)/.exec(className || '')

              if (!match) {
                return (
                  // make it beautiful with tw, just little bolder and add the backticks back
                  <code {...rest} className={className + ' '}>
                    {children}
                  </code>
                )
              }

              const source = '\n' + String(children).replace(/\n$/, '') + '\n'

              return (
                <div
                  // make the code sit in the middle
                  className="flex items-center justify-center"
                >
                  <MyEditor defaultValue={source} file={`file${codeRef.current++}.ts`} projectFiles={[]} />
                </div>
              )

              // return (
              //   <SyntaxHighlighter
              //     {...rest}
              //     PreTag="div"
              //     language={match[1]}
              //     // style={dark}
              //   >
              //     {String(children).replace(/\n$/, '')}
              //   </SyntaxHighlighter>
              // )
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
