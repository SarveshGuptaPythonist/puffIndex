import { ChakraProvider } from '@chakra-ui/react'
import { Analytics } from "@vercel/analytics/next"

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Analytics/>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}