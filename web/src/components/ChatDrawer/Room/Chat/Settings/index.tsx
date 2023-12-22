import React from 'react';
import { 
	Box,
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
    Flex,
	useToast,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from '@chakra-ui/react';
import { AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineClockCircle } from 'react-icons/ai';
import { API_URL } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { io } from 'socket.io-client';
import { 
	banMemberService,
	deleteRoomService, 
	getBannedMembersService, 
	getMutedMembersService, 
	getRoomMembers, 
	kickMemberService, 
	leaveRoomService,
	muteMemberService,
	setAdminService,
	unBanMemberService,
	unMuteMemberService,
	 
} from '@/utils/services';
import { BannedMembers } from './Banned';
import { Members } from './Members';
import { MutedMembers } from './Muted';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	roomId: number,
	closeAll: () => void; // this should be called when user is no longer part or room does not exists anymore !
}

export const ChatSettings : React.FC<Props> = ({isOpen, onClose, roomId, closeAll}) => {
	
	const toast = useToast();
	const [members, setMembers] = React.useState<any []>([]);
	const [banned, setBanned] = React.useState<any []>([]);
	const [muted, setMuted] = React.useState<any []>([]);

	React.useEffect(() => {
		getBannedMembers();
		getMutedMembers();
		(async () => {
			const response = await getRoomMembers(roomId);
			setMembers([...response]);
		})();
	}, [roomId]);

	const handleDeleteRoom = async () => {
		deleteRoomService(roomId).then(response => {
			//console.log("delete room response : ", response);
			toast({
				title: "Room Deleted Successfuly !",
				status: "success",
				duration: 9000,
				isClosable: true
			})
			closeAll();
			onClose();
		}).catch(e => {
			//console.log("deleting room error : ", e);
			toast({
				title: "Something went wrong deleting this room",
				status: "error",
				duration: 9000,
				isClosable: true
			})
		})
	}

	const handleLeavingRoom = () => {
		leaveRoomService(roomId).then(response => {
			//console.log("leaving room response", response)
			toast({
				title: "You're no longer part of this room",
				status: "success",
				duration: 9000,
				isClosable: true
			})
			closeAll();
			onClose();
		}).catch(e => {
			//console.log("leaving room error : ", e)
			toast({
				title: "Something went wrong trying to leave room",
				status: "error",
				duration: 9000,
				isClosable: true
			})
			
		})
	}

	const handleKickUser = (userID: number) => {
		kickMemberService(roomId, userID).then(response => {
			//console.log("kick user response : ", response);
			// update members;
			const tmp = [...members]
			const index = tmp.findIndex(x => x.id === userID);
			if(index != -1){
				tmp.splice(index, 1);
				setMembers([...tmp]);
			}
			toast({
				title: `you kicked ${members[index].username} lol`,
				status: "success",
				duration: 9000,
				isClosable: true	
			})
		}).catch(e => {
			//console.log("error : ", e);
			toast({
				title: "Something went wrong: Can't kick user",
				status: "error",
				duration: 9000,
				isClosable: true	
			})
		});
	}

	const handleBanUser = (userID: number) => {
		banMemberService(roomId, userID).then(response => {
			//console.log("ban user response : ", response);
			// update members;
			const tmp = [...members]
			const index = tmp.findIndex(x => x.id === userID);
			if(index != -1){
				const bannedUser = tmp.splice(index, 1)[0];
				//console.log("banned user : ", bannedUser)
				setMembers([...tmp]);
				setBanned([bannedUser, ...banned]);
			}
			toast({
				title: `you banned ${members[index].username}`,
				status: "success",
				duration: 9000,
				isClosable: true	
			})
		}).catch(e => {
			//console.log("error : ", e);
			toast({
				title: "Something went wrong: Can't ban user",
				status: "error",
				duration: 9000,
				isClosable: true	
			})
		});
	}

	const handleMuteUser = (userID: number, duration: number) => {
		muteMemberService(roomId, userID, duration * 60).then(response => {
			//console.log("mute user response : ", response);
			// update members;
			const tmp = [...members]
			const index = tmp.findIndex(x => x.id === userID);
			if(index != -1){
				const mutedUser = tmp.splice(index, 1)[0];
				setMembers([...tmp]);
				setMuted([mutedUser, ...muted]);
			}
			toast({
				title: `you muted ${members[index].username}`,
				status: "success",
				duration: 9000,
				isClosable: true	
			})
		}).catch(e => {
			//console.log("error : ", e);
			toast({
				title: "Something went wrong: Can't mute user",
				status: "error",
				duration: 9000,
				isClosable: true	
			})
		});
	}

	const getMutedMembers = () => {
		getMutedMembersService(roomId).then(response => {
			//console.log("muted users : ", response);
			setMuted([...response.mutedUsers]);
		}).catch(e => {
			//console.log("get muted members error : ", e);
			// toast({
			// 	title: "Something went wrong: Can't get muted users",
			// 	status: "error",
			// 	duration: 9000,
			// 	isClosable: true	
			// })
		});
	}

	const getBannedMembers = () => {
		getBannedMembersService(roomId).then(response => {
			//console.log("banned users response : ", response);
			setBanned([...response.bannedUsers]);
		}).catch(e => {
			//console.log("get banned members error : ", e);
			// toast({
			// 	title: "Something went wrong: Can't get banned users",
			// 	status: "error",
			// 	duration: 9000,
			// 	isClosable: true	
			// })
		});
	}

	const handleUnmuteMember = (uid: number) => {
		unMuteMemberService(roomId, uid).then(response => {
			//console.log("unmute user response : ", response);
			const index = muted.findIndex(x => x.id === uid);
			if(index != -1){
				const tmp = [...muted];
				const unMutedUser = tmp.splice(index, 1)[0];
				setMembers([unMutedUser, ...members]);
				setMuted([...tmp]);
				toast({
					title: `You unmuted ${unMutedUser.username} !`,
					duration: 9000,
					isClosable: true,
					status: "success"
				})
			}
			
		}).catch(e => {
			//console.log("something went wrong unmuting user : ", e);
			toast({
				title: `Something went wrong: can't unmute user !`,
				duration: 9000,
				isClosable: true,
				status: "error"
			});
		})
	}

	const handleUnbanMember = (uid: number) => {
		unBanMemberService(roomId, uid).then(response => {
			//console.log("unban user response : ", response);
			const index = banned.findIndex(x => x.id === uid);
			if(index != -1){
				const tmp = [...banned];
				const unBannedUser = tmp.splice(index, 1)[0];
				setMembers([unBannedUser, ...members]);
				setBanned([...tmp]);
				toast({
					title: `You unbanned ${unBannedUser.username} !`,
					duration: 9000,
					isClosable: true,
					status: "success"
				})
			}
			
		}).catch(e => {
			//console.log("something went wrong ubnaning user : ", e);
			toast({
				title: `Something went wrong: can't unban user !`,
				duration: 9000,
				isClosable: true,
				status: "error"
			});
		})
	}

	// set admin 
	const handleSetAdmin = (uid: number) => {
		setAdminService(roomId, uid).then(response => {
			//console.log("set admin response : ", response);
			const user = members.find(x => x.id === uid);
			// update members 
			setMembers(curr => curr.map(user => {
				if(user.id === uid){
					user.isAdmin = true
				}
				return user;
			}))
			toast({
				title: `You've added ${user.username || ''} as an admin !`,
				duration: 9000,
				isClosable: true,
				status: "success"
			})
		}).catch(e => {
			//console.log("something went wrong adding new admin : ", e);
			const user = members.find(x => x.id === uid);
			toast({
				title: `Something went wrong: Can't add ${user.username || ''} as an admin !`,
				duration: 9000,
				isClosable: true,
				status: "success"
			})
		})
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={'0px'}>
				
				<Flex m={'0px 0 20px'}>
					<Button size={'sm'} colorScheme='red' variant={'outline'} mr={'10px'} onClick={() => handleLeavingRoom()}>Leave Room</Button>
					<Button size={'sm'} colorScheme='red' variant={'outline'} mr={'10px'} onClick={() => handleDeleteRoom()} >Delete Room</Button>
				</Flex>
				<Members
					members={members}
					kick={(uid) => handleKickUser(uid)}
					ban={(uid) => handleBanUser(uid)}
					mute={(uid, duration) => handleMuteUser(uid, duration)}
					setAdmin={(userID) => handleSetAdmin(userID)}
				/>
				{
					banned.length > 0 && <BannedMembers banned={banned} unban={(uid) => handleUnbanMember(uid)} />
				}
				{
					muted.length > 0 && <MutedMembers muted={muted} unmute={(uid) => handleUnmuteMember(uid)} />
				}	
				
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blackAlpha' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
	)
}


/*<Flex alignItems={'center'}>
									<Button variant={'ghost'} p={0}>
										<AiOutlineUserDelete />
									</Button>
									<Button variant={'ghost'} p={0}>
										<AiOutlineClockCircle />
									</Button>
									<Button variant={'ghost'} p={0}>
										<AiOutlineUserAdd />
									</Button>
								</Flex>*/