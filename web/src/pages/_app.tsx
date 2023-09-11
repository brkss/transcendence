import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

//import { QueryClientProvider } from 'react-query';
//import { queryClient } from '../utils/client';

export default function App({ Component, pageProps }: AppProps) {
  return (
	   <ChakraProvider>
			<Component {...pageProps} />
		</ChakraProvider>
  )
}
