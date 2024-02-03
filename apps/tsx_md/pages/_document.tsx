import { Html, Head, Main, NextScript } from 'next/document'

import { cn } from '../src/lib/utils'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={cn('bg-background min-h-screen font-sans antialiased')}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
