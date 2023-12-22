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
import { blockUser, getFriends, getRequests, blockedUsers, unblockUser } from '@/utils/services';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	sendMessage: (uid: number) => void;
}

export const FriendsDrawer : React.FC<Props> = ({isOpen, onClose, sendMessage}) => {

	const toast = useToast();
	const [requests, setRequests] = React.useState<any[]>([]);
	const [friends, setFriends] = React.useState<any[]>([]);

	React.useEffect(() => {
		if(isOpen === true){
			(async () => {
				const reqs = await getRequests();
				const frds = await getFriends();
				//console.log("frds : ", frds);
				//console.log("get friends : ", frds);
				setFriends(frds);
				setRequests(reqs);
			})();
		}
	}, [isOpen]);

	const friendAccepted = (uid: number) => {
		const reqIndex = requests.findIndex(x => x.id === uid);
		//console.log("accespt friend : ", reqIndex, requests, friends);
		if(reqIndex > -1){
			const user = requests.splice(reqIndex, 1)[0];
			//console.log("spliced : ", user);
			setFriends([user, ...friends]);
		}
		//console.log("accespt friend : ", reqIndex, requests, friends);
	}

	const requestRejected = (uid: number) => {
		const reqIndex = requests.findIndex(x => x.id === uid);
		if(reqIndex > -1){
			const user = requests.splice(reqIndex, 1)[0];
			setRequests([...requests]);
		}
	}


	const handleUnblockingUser = (uid: number) => {
		unblockUser(uid).then(response => {
			//console.log("block user response : ", response);
			toast({
				status: 'success',
				title: "You unblocked user successfuly",
				isClosable: true,
				duration: 9000,
			});
			const tmp = friends.map(f => { if(f.id === uid) f.isBlocked = false; return f })
			setFriends([...tmp]);	
		}).catch(e => {
			//console.log("got an error unblocking user : ", e);
			toast({
				status: 'error',
				title: "Error: Can't unblock user !",
				isClosable: true,
				duration: 9000
			});	
		})
	}

	const handleBlockingUser = (uid: number) => {
		blockUser(uid).then(response => {
			//console.log("block user response : ", response);
			toast({
				status: 'success',
				title: "You blocked user successfuly",
				isClosable: true,
				duration: 9000,
			});
			const tmp = friends.map(f => { if(f.id === uid) f.isBlocked = true; return f })
			setFriends([...tmp]);
		}).catch(e => {
			//console.log("got an error : ", e);
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
								<RequestItem key={key} name={req.fullName} username={req.username} image={req.avatar} accepted={() => friendAccepted(req.id)} reject={() => requestRejected(req.id)} />
							))
						}
					</Box>
					<Box>
						{
							friends?.map((friend: any, key: number) => (
								<FriendBox unblockUser={() => handleUnblockingUser(friend.id)} blockUser={() => handleBlockingUser(friend.id)} sendMessage={() => sendMessage(friend.id)} key={key} name={friend.name} username={friend.username} image={friend.avatar} isBlocked={friend.isBlocked} status={friend.status} />
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
