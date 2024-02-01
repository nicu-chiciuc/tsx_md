import { GithubIcon } from '@/my_components/githubCorner/githubForkIcon'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import Ztext from 'react-ztext'

const IndexPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <GithubIcon />

      <MainNavigationMenu />

      <div className="flex h-screen items-center justify-center">
        <Ztext
          depth="1rem"
          direction="both"
          event="pointer"
          eventRotation="30deg"
          eventDirection="default"
          fade={false}
          layers={10}
          perspective="400px"
          style={{
            fontSize: '12rem',
          }}
        >
          tsx.md
        </Ztext>
      </div>
    </div>
  )
}

export default IndexPage
