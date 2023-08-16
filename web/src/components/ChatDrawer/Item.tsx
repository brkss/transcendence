import React from 'react';
import {  Box, Stack, Text, Center} from '@chakra-ui/react';
import { Avatar } from '../Avatar';
import { BsChatDots } from 'react-icons/bs'


export const ChatBox: React.FC = () => {

	return (
		<Box mt={'20px'}>
			<Stack direction={['column', 'row']} spacing={'10px'} cursor={'pointer'} transition={'.3s'} _hover={{bg: 'blackAlpha.100', transition: '.3s'}} p={'10px'} rounded={'10px'}>
				<Center h={'50px'} w={'50px'} bg={'black'} color={'white'} rounded={'100%'}>
					<BsChatDots color={'white'} size={'14px'} /> 
				</Center>
				<Box>
					<Text fontWeight={'bold'}>Room chat 1</Text>
					<Text bg={'green.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'1px 6px'} display={'inline-block'}>Password protected</Text>
				</Box>
				<Box ml={'auto'}>
					<Text fontSize={'14px'} fontWeight={'bold'}>2 online</Text>
				</Box>
			</Stack>
		</Box>
	)
}
