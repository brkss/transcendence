import React from 'react';
import { Box, Center, Text, Button, Image, keyframes } from '@chakra-ui/react';
import { animations, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import queryString from 'querystring';

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
    	parseParams();
  	}, []);

	const parseParams = () => {
		const params = queryString.parse(window.location.search)
		const code = params["?code"];
		if (code) {
		  	console.log("code => ", code);
		}
	}

	const authorize = () => {
		window.location.replace("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a55cb78b3aaae4ed7999c69dfcc0523f616a5feb8bc99aeee165809d0db4a328&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin&response_type=code");
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
