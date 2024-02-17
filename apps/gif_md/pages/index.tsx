import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`flex h-full items-center justify-center bg-black ${inter.className}`}>
      <a href="https://tsx.md">
        <img src="/dancing_baby.gif" />
      </a>
    </main>
  )
}
