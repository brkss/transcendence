

import { Box, Center, Text, Button, Image, keyframes } from '@chakra-ui/react';
import { animations, motion } from 'framer-motion';


const lightKeyframes = keyframes`

	0% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.4); }
	25% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.3); }
	50% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.2); }
	75% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.3); }
	100% { box-shadow: 0px 0px 20px 4px rgba(255, 255, 255, 0.4); }
`;

const animation = `${lightKeyframes} 2s infinite`;

export default function Login(){

	return (
		<>
			<Box h={'100vh'} bg={'#000000'}>
				<Center h={'100vh'}>
					<Button as={motion.button} transition={'.3s'} animation={animation}  _hover={{bg: "black"}} size={'lg'} bg={'#131313'}>
						<Image filter={'invert(1)'} w={'25px'} mr={'15px'} src={'/images/42-logo.jpeg'} />
						<Text fontWeight={'bold'} color={'white'}>Login With Intra</Text>
					</Button>
				</Center>
			</Box>
		</>
	)
}
