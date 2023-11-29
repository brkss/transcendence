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
	Box
} from '@chakra-ui/react'
import { FriendBox } from './Item';
import { RequestItem } from './RequestItem'
import { getFriends, getRequests } from '@/utils/services';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	sendMessage: (uid: number) => void;
}

export const FriendsDrawer : React.FC<Props> = ({isOpen, onClose, sendMessage}) => {

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
								<FriendBox sendMessage={() => sendMessage(friend.id)} key={key} name={friend.name} username={friend.username} image={friend.avatar} />
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
