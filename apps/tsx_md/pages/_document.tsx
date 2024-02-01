import { Html, Head, Main, NextScript } from 'next/document'

import { cn } from '../src/shadcn/lib/utils'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
