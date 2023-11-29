import React from 'react';
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Heading,
	Box,
	useToast
} from '@chakra-ui/react'
import { FriendBox } from './Item';
import { RequestItem } from './RequestItem'
import { blockUser, getFriends, getRequests } from '@/utils/services';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	sendMessage: (uid: number) => void;
}

export const FriendsDrawer : React.FC<Props> = ({isOpen, onClose, sendMessage}) => {

	const toast = useToast();
	const [requests, setRequests] = React.useState<any>([]);
	const [friends, setFriends] = React.useState<any>([]);

	React.useEffect(() => {
		if(isOpen === true){
			(async () => {
				const reqs = await getRequests();
				const frds = await getFriends(); 
				console.log("get friends : ", frds);
				setFriends(frds);
				setRequests(reqs);
			})();
		}
	}, [isOpen]);

	const handleBlockingUser = (uid: number) => {
		blockUser(uid).then(response => {
			console.log("block user response : ", response);
			toast({
				status: 'success',
				title: "You blocked user successfuly",
				isClosable: true,
				duration: 9000,
			});
		}).catch(e => {
			console.log("got an error : ", e);
			toast({
				status: 'error',
				title: "Error: Can't block user !",
				isClosable: true,
				duration: 9000
			});
		})
	}

	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size={'md'}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader></DrawerHeader>

				<DrawerBody>
					<Heading>Friends</Heading>
					<Box pb={'25px'} mb={'10px'} borderBottom={'1px dotted #c5c4c4'}>
						{
							requests.map((req: any, key: number) => (
								<RequestItem key={key} name={req.fullName} username={req.username} image={req.avatar} accept={() => {}} />
							))
						}
					</Box>
					<Box>
						{
							friends.map((friend: any, key: number) => (
								<FriendBox blockUser={() => handleBlockingUser(friend.id)} sendMessage={() => sendMessage(friend.id)} key={key} name={friend.name} username={friend.username} image={friend.avatar} />
							))
						}
					</Box>
				</DrawerBody>

				<DrawerFooter>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
