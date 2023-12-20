import React from 'react';
import { Menu, MenuItem, MenuList, MenuButton, Box, GridItem, Stack, Text, Button, IconButton} from '@chakra-ui/react';
import { Avatar } from '../Avatar';


interface Props {
	name: string;
	username: string;
	image: string;
	sendMessage: () => void;
	blockUser: () => void;
	unblockUser: () => void;
	isBlocked: boolean;
}

export const FriendBox: React.FC<Props> = ({name, username, image, sendMessage, blockUser, isBlocked, unblockUser}) => {

	return (
		<Box mt={'30px'} opacity={isBlocked ? .8 : 1}>
			<Stack direction={['column', 'row']} spacing={'10px'}>
				<Avatar d={'50px'} src={image} />
				<Box>
					<Text fontWeight={'bold'}>@{username}</Text>
					{
						isBlocked ? 
						<Text bg={'orange.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'1px 6px'} display={'inline-block'}>blocked</Text>
						: 
						<Text bg={'green.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'1px 6px'} display={'inline-block'}>online</Text>
					}
					
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
						{
							!isBlocked ? (
								<MenuList>
									<MenuItem onClick={sendMessage}>
										Send Message
									</MenuItem>
									<MenuItem >
										Invite to game
									</MenuItem>
									<MenuItem onClick={blockUser} >
										Block
									</MenuItem>
								</MenuList>
							) : (
								<MenuList>
									<MenuItem onClick={unblockUser} >
										unblock	
									</MenuItem>
								</MenuList>
							)
						}
						
					</Menu>
				</Box>
			</Stack>
		</Box>
	)
}
