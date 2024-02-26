import { Inter } from 'next/font/google'
import MainPage from '@/components/view/MainPage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`flex min-h-screen items-center justify-between p-12 ${inter.className}`}>
      <MainPage />
    </main>
  )
}
