import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter as FontSans } from 'next/font/google'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    /**
     * https://github.com/vercel/next.js/issues/44840#issuecomment-1442347859
     *
     * I wanted to add the font from shadcn https://ui.shadcn.com/docs/installation/next
     */
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --font-sans: ${fontSans.style.fontFamily};
        }`,
        }}
      />

      <Component {...pageProps} />
    </>
  )
}
