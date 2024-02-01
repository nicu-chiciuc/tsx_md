import Md from 'react-markdown'
import ts from 'typescript'
import prettier from 'prettier'
import fs from 'node:fs/promises'
import path from 'node:path'
import { InferGetStaticPropsType } from 'next'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

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

${code('typescript', props.sourceCode)}
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

  return {
    props: {
      sourceCode: prettyCode,
    },
  }
}
