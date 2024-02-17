import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`flex h-full grow flex-col items-center justify-between ${inter.className}`}>
      <img src="/dancing_baby.gif" />
    </main>
  )
}
