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
import { Avatar } from '../../Avatar'
import { AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineClockCircle } from 'react-icons/ai';
import { API_URL } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { io } from 'socket.io-client';
import { deleteRoomService, getRoomMembers, leaveRoomService } from '@/utils/services';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	roomId: number,
	closeAll: () => void; // this should be called when user is no longer part or room does not exists anymore !
}

export const ChatSettings : React.FC<Props> = ({isOpen, onClose, roomId, closeAll}) => {
	
	const toast = useToast();
	const [members, setMembers] = React.useState<any []>([]);

	React.useEffect(() => {
		(async () => {
			const response = await getRoomMembers(roomId);
			console.log("room members : ", response);
			setMembers([...response]);
		})();
	}, [roomId]);

	const handleDeleteRoom = async () => {
		deleteRoomService(roomId).then(response => {
			console.log("delete room response : ", response);
			toast({
				title: "Room Deleted Successfuly !",
				status: "success",
				duration: 9000,
				isClosable: true
			})
			closeAll();
			onClose();
		}).catch(e => {
			console.log("deleting room error : ", e);
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
			console.log("leaving room response", response)
			toast({
				title: "You're no longer part of this room",
				status: "success",
				duration: 9000,
				isClosable: true
			})
			closeAll();
			onClose();
		}).catch(e => {
			console.log("leaving room error : ", e)
			toast({
				title: "Something went wrong trying to leave room",
				status: "error",
				duration: 9000,
				isClosable: true
			})
			
		})
	}

	const handleBanUser = () => {

	}

	const handleMuteUser = () => {

	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={'10px'}>
				<Text fontWeight={'bold'}>General</Text>
				<Flex m={'10px 0'}>
					<Button size={'sm'} colorScheme='red' variant={'outline'} mr={'10px'} onClick={() => handleLeavingRoom()}>Leave Room</Button>
					<Button size={'sm'} colorScheme='red' variant={'outline'} mr={'10px'} onClick={() => handleDeleteRoom()} >Delete Room</Button>
				</Flex>
				<Text fontWeight={'bold'}>Members</Text>
				{
					members.map((member, key) => (
						<Flex border={'2px solid transparent'} borderColor={member.isAdmin ? "gold" : "transparent"} key={key} alignItems={'center'} justifyContent={'space-between'} p={'10px'} m={'10px 0'} bg={'#f0f0f0'} rounded={'14px'}>
							<Flex alignItems={'center'}>
								<Avatar d={'40px'} src={member.avatar} />
								<Text fontWeight={'bold'} ml={'10px'}>@{member.username}</Text>
							</Flex>
							{/* check if current user id admin ! */}
							{true && 
								
								<Menu>
									<MenuButton
										aria-label='Options'
										as={Button}
										size={'sm'}
										variant={'unstyled'}
									>
										options
									</MenuButton>
									<MenuList fontSize={'14px'} fontWeight={'bold'}>
										<MenuItem >
											Set Admin
										</MenuItem>
										<MenuItem >
											Ban
										</MenuItem>
										<MenuItem  >
											Mute
										</MenuItem>
										<MenuItem  color={'red.500'}>
											Kick
										</MenuItem>
									</MenuList>
								</Menu>
							}
							
						</Flex>			
					))
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