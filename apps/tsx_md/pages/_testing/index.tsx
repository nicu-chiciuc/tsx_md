import Md from 'react-markdown'
import ts from 'typescript'
import prettier from 'prettier'
import path from 'path'
import fs from 'fs/promises'
import { InferGetStaticPropsType } from 'next'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { MyEditor } from '@/my_components/monacoEditor'
import { arrayOf } from '@robolex/dependent'
import { readProjectFiles } from '@/server/main'

// Utility function to trim empty lines.
const trimEmptyLines = (str: string) => str.replace(/^\s*[\r\n]/gm, '')

// Function to format code blocks with syntax highlighting.
const code = (extension: string, content: string): string => `\`\`\`${extension}\n${trimEmptyLines(content)}\n\`\`\``

function isAnyDeclaration(node: ts.Node): node is ts.DeclarationStatement {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isVariableDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node) ||
    ts.isModuleDeclaration(node)
  )
}

// Function that will traverse the AST of a given piece of code and return as string.
const extractFunctionSource = (sourceCode: string, functionName: string): string | null => {
  let sourceFile: ts.SourceFile

  try {
    sourceFile = ts.createSourceFile(
      'code.ts', // Filename is arbitrary for parsing purposes.
      sourceCode,
      ts.ScriptTarget.Latest,
      true // Set parent pointers in nodes.
    )
  } catch (e) {
    console.log(e)
    throw new Error('Could not parse source code.')
  }

  let functionText: string | null = null

  const visitNode = (node: ts.Node) => {
    if (isAnyDeclaration(node)) {
      if (node.name && node.name.text === functionName) {
        functionText = node.getFullText(sourceFile)
      }
    }

    // Continue traversing if we have not found our function yet.
    if (!functionText) {
      node.forEachChild(visitNode)
    }
  }

  visitNode(sourceFile)

  return functionText
}

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="flex h-screen items-center justify-center ">
      <div className="prose lg:prose-xl">
        <Md
          components={{
            code(props) {
              const { children, className, node, ...rest } = props
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
        >{`
# Hello World

This is a markdown file

## This is a subheading 

This is a paragraph

- This is a list
- This is another list item


`}</Md>
        <MyEditor
          file="sample1.ts"
          lang="typescript"
          projectFiles={props.projectFiles}
          defaultValue={`
import { good } from '@robolex/sure';

const myVar = good(99);
`}
        />

        <MyEditor
          file="sample2.ts"
          lang="javascript"
          projectFiles={props.projectFiles}
          defaultValue={`
import { bad } from '@robolex/sure';

const myVar = bad(34);
`}
        />

        {/* <iframe
          src="https://codesandbox.io/p/github/nicu-chiciuc/stackblitz-starters-5fj1s6/main?file=%2Findex.js&embed=1"
          style={{
            width: '500px',
            height: '500px',
            border: 0,
            borderRadius: '4px',
            overflow: 'hidden',
          }}
          title="nicu-chiciuc/stackblitz-starters-5fj1s6/main"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="hidenavigation allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts "
        ></iframe> */}

        {arrayOf(0, null).map((_, i) => {
          return <MyEditor key={i} projectFiles={props.projectFiles} defaultValue={props.sourceCode} />
        })}

        <Md>{`
Something else here
        `}</Md>
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const fileContents = await fs.readFile(path.join(process.cwd(), 'pages/blog/index.tsx'), 'utf8')
  const functionText = extractFunctionSource(fileContents, getStaticProps.name) ?? ''

  // format using prettier
  const prettyCode = await prettier.format(functionText, { parser: 'typescript' })

  const value = await readProjectFiles()

  // INFO: Doesn't lower the bundle size that much
  // filter files that are not package.json or .d.ts
  const filteredFiles = value.filter(file => !file.small.endsWith('package.json') && !file.small.endsWith('.d.ts'))

  return {
    props: {
      projectFiles: filteredFiles,
      sourceCode: prettyCode,
    },
  }
}
