import React from 'react';
import { Menu, MenuItem, MenuList, MenuButton, Box, GridItem, Stack, Text, Button, IconButton} from '@chakra-ui/react';
import { Avatar } from '../../Avatar';


interface Props {
	name: string;
	username: string;
	image: string;
	enterChat: () => void;
}

export const DMBox: React.FC<Props> = ({name, username, image, enterChat}) => {

	return (
		<Box p={'10px'} bg={'#e9e9e97a'} rounded={'14px'} mt={'30px'} onClick={enterChat} cursor={'pointer'} transition={'.3s'} _hover={{bg: '#dcd9d97a', transition: '.3s'}}>
			<Stack direction={['column', 'row']} spacing={'10px'}>
				<Avatar d={'50px'} src={image} />
				<Box>
					<Text fontWeight={'bold'}>{name}</Text>
                    <Text fontSize={'14px'} fontWeight={'bold'}>@{username}</Text>
					{/*<Text bg={'green.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'1px 6px'} display={'inline-block'}>online</Text>*/}
				</Box>
			</Stack>
		</Box>
	)
}
