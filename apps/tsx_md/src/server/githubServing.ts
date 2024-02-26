import { serialize } from 'next-mdx-remote/serialize'

export async function loadGithubUrl(queryUrlP: string[]) {
  const queryUrl = [...queryUrlP]

  // Remove the blog and server from the URL
  if (queryUrl[2] === 'blob') {
    queryUrl.splice(2, 1)
  }

  const url = queryUrl.join('/')

  // Load the file from github
  const res = await fetch(`https://raw.githubusercontent.com/${url}`)

  const mdText = await res.text()

  const mdSerialized = await serialize(mdText, {
    parseFrontmatter: true,

    mdxOptions: {
      format: 'md',
    },
  })

  return {
    ghUrl: queryUrl,
    mdSerialized,
  }
}
