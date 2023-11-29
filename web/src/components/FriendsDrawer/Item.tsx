import React from 'react';
import { Menu, MenuItem, MenuList, MenuButton, Box, GridItem, Stack, Text, Button, IconButton} from '@chakra-ui/react';
import { Avatar } from '../Avatar';


interface Props {
	name: string;
	username: string;
	image: string;
	sendMessage: () => void;
}

export const FriendBox: React.FC<Props> = ({name, username, image, sendMessage}) => {

	return (
		<Box mt={'30px'}>
			<Stack direction={['column', 'row']} spacing={'10px'}>
				<Avatar d={'50px'} src={image} />
				<Box>
					<Text fontWeight={'bold'}>@{username}</Text>
					<Text bg={'green.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'1px 6px'} display={'inline-block'}>online</Text>
				</Box>
				<Box ml={'auto'}>
					<Menu>
						<MenuButton
							aria-label='Options'
							as={Button}
							size={'sm'}
						>
							options
						</MenuButton>
						<MenuList>
							<MenuItem onClick={sendMessage}>
								Send Message
							</MenuItem>
							<MenuItem >
								Invite to game
							</MenuItem>
							<MenuItem  >
								Block
							</MenuItem>
						</MenuList>
					</Menu>
				</Box>
			</Stack>
		</Box>
	)
}
