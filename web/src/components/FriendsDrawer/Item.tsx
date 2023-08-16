import React from 'react';
import { Menu, MenuItem, MenuList, MenuButton, Box, GridItem, Stack, Text, Button, IconButton} from '@chakra-ui/react';
import { Avatar } from '../Avatar';




export const FriendBox: React.FC = () => {



	return (
		<Box mt={'30px'}>
			<Stack direction={['column', 'row']} spacing={'10px'}>
				<Avatar d={'50px'} />
				<Box>
					<Text fontWeight={'bold'}>@Avocado</Text>
					<Text bg={'green.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'2px 3px'} display={'inline-block'}>online</Text>
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
							<MenuItem >
								New Message
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
