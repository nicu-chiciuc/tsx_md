import { array, string } from '@robolex/sure'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { MarkdownComponentsMonaco } from '@/my_components/monacoEditor'
import { MDXRemote } from 'next-mdx-remote'
import { loadGithubUrl } from '@/server/githubServing'
import { GithubCorner } from '@/my_components/githubCorner/githubForkIcon'
import { MAIN_REPO } from '@/constants'

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const [isOk, val] = array(string)(router.query.user_repo_file)

  if (!isOk) return <p>Invalid URL</p>

  const link = `${MAIN_REPO}/blob/main/apps/tsx_md/pages/github.com/[...user_repo_file].tsx`

  return (
    <div className="flex w-full flex-col items-center ">
      <GithubCorner href={link} />
      <MainNavigationMenu />

      <main className="w-full p-5">
        <article className="prose mx-auto mb-14 break-words">
          <MDXRemote {...props.mdSerialized} components={MarkdownComponentsMonaco} />
        </article>
      </main>
    </div>
  )
}

// TODO: implement tupleRet
// const schema = tuple([string, string, tupleRest(array(string))])

export const getServerSideProps = (async context => {
  const [isOk, val] = array(string)(context.query.user_repo_file)

  if (!isOk) {
    throw new Error('Invalid URL')
  }

  const props = loadGithubUrl(val)

  return {
    props,
  }
}) satisfies GetServerSideProps
