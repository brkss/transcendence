import React from 'react';
import { useToast, Menu, MenuItem, MenuList, MenuButton, Box, GridItem, Stack, Text, Button, IconButton} from '@chakra-ui/react';
import { Avatar } from '../Avatar';
import { acceptFriend, rejectFriend } from '@/utils/services'

interface Props {
	name: string;
	username: string;
	image: string;
	accepted: () => void;
	reject: () => void;
}

export const RequestItem: React.FC<Props> = ({name, username, image, accepted, reject}) => {

	const toast = useToast();

	const handleAcceptFriend = async () => {
		
		const response = await acceptFriend(username);
		if(response.error){
			toast({
				title : response.error,
				status: 'warning',
				duration: 9000,
				isClosable: true,
			});
			
		}else if(response.success){
			toast({
				title: response.success,
				status: 'success',
				duration: 9000,
				isClosable: true,
			})
			accepted();
		}
		
		
		//console.log("add friend : ", response);
	}

	const handleReject = () => {
		rejectFriend(username).then( _ => {
			toast({
				title: "Request Rejected !",
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
			reject()
		}).catch(e => {
			console.log("err : ", e);
			toast({
				title : "Could not Reject Request !",
				status: 'warning',
				duration: 9000,
				isClosable: true,
			});
		})
	}

	return (
		<Box mt={'30px'}>
			<Stack direction={['column', 'row']} spacing={'10px'}>
				<Avatar d={'50px'} src={image} />
				<Box>
					<Text fontWeight={'bold'}>@{username}</Text>
					<Text bg={'orange.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'1px 6px'} display={'inline-block'}>Request</Text>
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
							<MenuItem onClick={handleAcceptFriend} >
								Accept	
							</MenuItem>
							<MenuItem onClick={handleReject}>
								Reject	
							</MenuItem>
							
						</MenuList>
					</Menu>
				</Box>
			</Stack>
		</Box>
	)
}
