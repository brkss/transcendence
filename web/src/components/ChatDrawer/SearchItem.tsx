import React from 'react';
import {  Box, Stack, Text, Center, Button} from '@chakra-ui/react';
import { Avatar } from '../Avatar';
import { BsChatDots } from 'react-icons/bs'

interface Props {
	type: string;
	name: string;
	join: () => void;
}

export const SearchChatBox: React.FC<Props> = ({type, name, join}) => {

	return (
		<Box mt={'20px'} >
			<Stack flexDir={'row'} direction={['column', 'row']} spacing={'10px'} bg={''} transition={'.3s'} p={'10px'} rounded={'10px'}>
				<Center h={'50px'} w={'50px'} bg={'black'} color={'white'} rounded={'100%'}>
					<BsChatDots color={'white'} size={'14px'} /> 
				</Center>
				<Box>
					<Text fontWeight={'bold'}>{name}</Text>
					<Text bg={'green.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'1px 6px'} display={'inline-block'}>{type}</Text>
				</Box>
				<Box ml={'auto'}>
					<Button onClick={join}>Join</Button>
				</Box>
			</Stack>
		</Box>
	)
}
