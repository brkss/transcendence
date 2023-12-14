import React from 'react';
import { Box, Center, Text, Button, Image, keyframes } from '@chakra-ui/react';
import { animations, motion } from 'framer-motion';
import queryString from 'querystring';
import { API_URL } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { useRouter } from 'next/router';

const lightKeyframes = keyframes`
	0% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.4);}
	25% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.3);}
	50% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.2);}
	75% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.3);}
	100% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.4);}
`;

const animation = `${lightKeyframes} 2s infinite`;

export default function Login(){

	const router = useRouter();

	React.useEffect(() => {
		if(getAccessToken())
			router.push("/")
	}, [router])

	const authorize = () => {
		window.location.replace(`${API_URL}/auth/sync`);
	}

	return (
		<>
			<Box h={'100vh'} bg={'#000000'}>
				<Center h={'100vh'}>
					<Button onClick={() => authorize()} as={motion.button} transition={'.3s'} animation={animation}  _hover={{bg: "black"}} size={'lg'} bg={'#131313'}>
						<Image filter={'invert(1)'} w={'25px'} mr={'15px'} src={'/images/42-logo.jpeg'} />
						<Text fontWeight={'bold'} color={'white'}>Login With Intra</Text>
					</Button>
				</Center>
			</Box>
		</>
	)
}
