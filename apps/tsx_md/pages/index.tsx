import { GithubCorner } from '@/my_components/githubCorner/githubForkIcon'
import { MainNavigationMenu } from '@/my_components/mainNavMenu'
import { useEffect, useState } from 'react'
import Ztext from 'react-ztext'

const IndexPage: React.FC = () => {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    setShowText(true)
  }, [])

  return (
    // in TW height: 100% is "h-full" and width: 100% is "w-full
    <div className="flex h-full flex-col items-center">
      <GithubCorner />
      <MainNavigationMenu />

      <main className="flex grow">
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
