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
    useDisclosure,
    Button
} from '@chakra-ui/react'
import { ChatBox } from './Item';
import { RoomPasswordModal } from './RoomPasswordModal';
import { Chat } from './Chat'
import { SearchChat } from './Search';
import {  AiOutlinePlusCircle } from 'react-icons/ai';
import { CreateRoom } from './CreateRoom'
import { API_URL } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { io } from 'socket.io-client';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const ChatDrawer: React.FC<Props> = ({isOpen, onClose}) => {

	const [rooms, setRooms] = React.useState<any[]>([]);
	let socket = io(API_URL, {
		extraHeaders: {
			Authorization: getAccessToken()
		}
	})
	const [selectedRoomID, setSelectedRoomID] = React.useState<number | null>(null);
	const [openCreateModal, setOpenCreateModal] = React.useState(false);
	const [openModal, setOpenModal] = React.useState(false);
	const [openChat, setOpenChat] = React.useState(false);
	const _passDisclosure = useDisclosure(); 
	const _createRoomModal = useDisclosure();
	const _chat = useDisclosure();

	React.useEffect(() => {
		socket.connect()
		
		socket.on('connect', () => {
			console.log("socket connected ! chats")
		})

		socket.on("rooms", (data) => {
			setRooms(data);
			console.log("data : ", data);
		})

		socket.emit("allRooms")

		return () => {
			socket.disconnect()
			console.log("socket disconnect!")
		}

	}, [isOpen])


	const handleEntringRoom = (id: number, isProtected: boolean) => {
		console.log("id : ", id, isProtected)
		if(isProtected){
			setOpenModal(true);
			_passDisclosure.onOpen();
			setSelectedRoomID(id)
		}else {
			setOpenChat(true);
			_chat.onOpen();
			setSelectedRoomID(id)
		}
	}

	

	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size={'lg'}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader></DrawerHeader>

				<DrawerBody>
					<Box display={'flex'} justifyContent={'space-between'} mt={'20px'} alignItems={'center'}>
						<Heading>Chat</Heading>
						<Button size={'sm'}  onClick={_createRoomModal.onOpen}>
							<AiOutlinePlusCircle style={{marginRight: '5px'}} />
							Create new room
						</Button>
					</Box>
					<SearchChat change={(v) => {}} />
					<Box>
						{
							rooms.map((item, key) => (
								<>	
									<ChatBox key={key} name={item.name} type={item.roomType}  enter={() => handleEntringRoom(item.id, item.roomType === "PROTECTED")} />
									<hr style={{marginTop: '10px', display: 'none'}} />	
								</>
							))
						}
					</Box>
				</DrawerBody>

				<DrawerFooter>
				</DrawerFooter>
			</DrawerContent>
			{ openModal && <RoomPasswordModal isOpen={_passDisclosure.isOpen} onClose={_passDisclosure.onClose} onOpen={_passDisclosure.onOpen} /> }
			{ selectedRoomID && openChat && <Chat chatId={selectedRoomID} isOpen={_chat.isOpen} onClose={_chat.onClose} /> }
			{ _createRoomModal.isOpen && <CreateRoom updateRooms={(room: {name: string, roomType: string}) => setRooms([room, ...rooms])} isOpen={_createRoomModal.isOpen} onClose={_createRoomModal.onClose} /> }
		</Drawer>
	)
}
