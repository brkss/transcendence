import React from 'react'
import { withAuth } from "@/components";
import { Center } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import decode from 'jwt-decode';
import { getAccessToken } from '@/utils/token';

function Home(){

	const router = useRouter();
	
	React.useEffect(() => {
		(() => {
			const payload = decode(getAccessToken())  as any;
			if(payload){
				router.push(`/user/${payload.username}`)
			}else {
				//console.log("log this out : ", payload)
				// logout !
			}
		})()
	}, []);

	

	return <Center h={'100vh'}>
		
	</Center>

}


export default withAuth(Home);
