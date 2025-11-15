import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚬</text></svg>" />
        <meta name="theme-color" content="#667eea" />

        {/* Default meta tags */}
        <meta name="description" content="PuffsIndex - Convert air pollution to cigarette equivalents. Stop using confusing PM2.5 numbers, start understanding air quality in terms everyone recognizes." />
        <meta name="keywords" content="air quality, AQI, cigarette equivalent, pollution, PM2.5, air pollution calculator, puffIndex" />

        {/* Open Graph */}
        <meta property="og:site_name" content="PuffsIndex" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://puffsindex.com/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@puffsindex" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}