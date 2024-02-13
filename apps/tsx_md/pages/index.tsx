import { GithubIcon } from '@/my_components/githubCorner/githubForkIcon'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { useEffect, useState } from 'react'
import Ztext from 'react-ztext'

const IndexPage: React.FC = () => {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    setShowText(true)
  }, [])

  return (
    <div className="flex max-h-screen w-full flex-col items-center">
      <GithubIcon />
      <MainNavigationMenu />

      <main className="h-full ">
        <div className="flex items-center justify-center overflow-hidden">
          {showText && (
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
                fontSize: '5rem',
              }}
            >
              tsx.md
            </Ztext>
          )}
        </div>
      </main>
    </div>
  )
}

export default IndexPage
