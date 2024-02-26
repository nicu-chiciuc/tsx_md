import { InferGetStaticPropsType } from 'next'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { GithubCorner } from '@/my_components/githubCorner/githubForkIcon'
import Link from 'next/link'
import { getArticles } from '@/server/blogServing'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { MarkdownComponentsMonaco } from '@/my_components/monacoEditor'

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="container flex flex-col items-center overflow-hidden">
      <GithubCorner />
      <MainNavigationMenu />

      <div className="flex items-center justify-center ">
        <article className="prose lg:prose-xl">
          <MDXRemote {...props.mdxSerialized} components={MarkdownComponentsMonaco} />
        </article>
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const mdContent = `
## Typescript markdown viewer

If you're viewing some markdown file on github that contains Typescript, e.g.

[github.com/robolex-app/public_ts/blob/main/README.md](https://github.com/robolex-app/public_ts/blob/main/README.md)

you can add 'tsx.md' before the github and render the markdown with full Typescript support.

For example, the above link becomes:

[tsx.md/github.com/robolex-app/public_ts/blob/main/README.md](https://tsx.md/github.com/robolex-app/public_ts/blob/main/README.md)

The code will be rendered like this:
${'```ts'}
import { object, string, number, InferGood, InferBad } from '@robolex/sure'

const schema = object({
  name: string,
  age: number,
})

// Hover over the types below
type Schema = InferGood<typeof schema>
type Issues = InferBad<typeof schema>

const good: Schema = {
  name: 'John',
  age: '99', // error here
}
  
${'```'}
  `

  const mdxSerialized = await serialize(
    mdContent,

    {
      parseFrontmatter: true,

      mdxOptions: {
        format: 'md',
      },
    }
  )

  return {
    props: {
      mdxSerialized,
    },
  }
}
