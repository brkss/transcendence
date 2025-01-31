import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, useDisclosure, Button, Box } from '@chakra-ui/react'
import React from 'react'
import { API_URL } from '@/utils/constants';
import { getAccessToken, setAccessToken } from '@/utils/token';
import { Loading } from '@/components';
import { profile } from '@/utils/services';


export default function App({ Component, pageProps }: AppProps) {
  
	const [loading, setLoading] = React.useState(true);
	
	

	React.useEffect(() => {	
		fetch(`${API_URL}/auth/refresh-token`, {
			credentials: 'include',
			method: "POST"
		}).then(async res => {
			const data = await res.json();
			//console.log("data : ", data);
			if(data.status === true){
				setAccessToken(data.access_token)
				
				//console.log("access token : ", getAccessToken());
			}
			setLoading(false);
		}).catch(e => {
			//console.log("something went wrong fetching access_token : ", e)
			setLoading(false);
		});

		
			
	}, []);

	if(loading)
		return <Loading />

	return (
	   <ChakraProvider>
			
			<Component {...pageProps} />
			
		</ChakraProvider>
  )
}
