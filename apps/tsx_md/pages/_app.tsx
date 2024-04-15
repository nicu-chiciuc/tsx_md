import '../src/styles/globals.scss'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import '../src/logRocketSetup'

import { Inter as FontSans } from 'next/font/google'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

import type { AppProps } from 'next/app'
import Head from 'next/head'

// import ThemeProvider from '../src/material-kit/theme'

function App({ Component, pageProps }: AppProps) {
  return (
    /**
     * https://github.com/vercel/next.js/issues/44840#issuecomment-1442347859
     *
     * I wanted to add the font from shadcn https://ui.shadcn.com/docs/installation/next
     *
     *
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

      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

        <title>Typescript-oriented blog of Nicu Chiciuc</title>

        <meta
          name="description"
          content="Contains articles or other tools related to Typescript, JSX and Markdown. Mostly Typescript thought."
        />

        <meta name="keywords" content="typescript, jsx, markdown" />

        <meta name="author" content="Nicu Chiciuc" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
