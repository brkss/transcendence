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
    Button,
	Text
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
import { getUserRooms, joinRoomService, searchRooms } from '@/utils/services';
import { SearchChatBox } from './SearchItem';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const ChatDrawer: React.FC<Props> = ({isOpen, onClose}) => {

	const [roomPassword, setRoomPassword]= React.useState("");
	const [joinRoomId, setJoinRoomId] = React.useState(-1);
	const [query, setQuery] = React.useState("");
	const [rooms, setRooms] = React.useState<any[]>([]);
	const [searchRes, setSearchRes] = React.useState<any[]>([]);
	const [selectedRoomID, setSelectedRoomID] = React.useState<number | null>(null);
	const [openCreateModal, setOpenCreateModal] = React.useState(false);
	const [openModal, setOpenModal] = React.useState(false);
	const [openChat, setOpenChat] = React.useState(false);
	const _passDisclosure = useDisclosure(); 
	const _createRoomModal = useDisclosure();
	const _chat = useDisclosure();

	React.useEffect(() => {
		(async () => {
			const _data = await getUserRooms();	
			console.log("rooms : ", _data);
			setRooms(_data);
		})();
	}, []);

	const handleEntringRoom = (id: number, isProtected: boolean) => {
		setOpenModal(true);
		_passDisclosure.onOpen();
		setJoinRoomId(id);
		//console.log("id : ", id, isProtected)
		/*
		if(isProtected){
			setOpenModal(true);
			_passDisclosure.onOpen();
			setSelectedRoomID(id)
		}else {
			setOpenChat(true);
			_chat.onOpen();
			setSelectedRoomID(id)
		}
		*/
	}

	const handleSearch = async (query: string) => {
		setQuery(query);
		if(query.length < 3){
			setSearchRes([]);
			return;
		}
		const results = await searchRooms(query);
		console.log("search results : ", results);
		setSearchRes(results);
	}

	const requestJoinRoom = async () => {
		const room = searchRes.find(x => x.id === joinRoomId);
		if(room){
			const data = {
				password: roomPassword,
				id: room.id,
				type: room.roomType
			}
			setRoomPassword("")
			setJoinRoomId(-1);
			await handleJoinRoom(data.id, data.type, data.password);
		}
	}

	const handleJoinRoom = async (roomID: number, roomType: string, password?: string) => {
		const response = await joinRoomService({room_id: roomID, roomType: roomType, password: password || ""});
		console.log("joim room response : ", response);
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
					<SearchChat change={(v) => handleSearch(v)} />
					<Box>
						
						<Text fontWeight={'bold'}>{searchRes.length > 0 ? "Search Results" : query.length == 0  ? "" : "No Result Found"}</Text>
						{
							searchRes.length === 0 && query.length == 0 ? ( rooms.map((item, key) => (
								<>	
									<ChatBox key={key} name={item.name} type={item.roomType}  enter={() => {}} />
									<hr style={{marginTop: '10px', display: 'none'}} />	
								</>
							))) : (
								<>
									{
										searchRes.map((item, key) => (
											<SearchChatBox key={key} name={item.name} type={item.roomType} join={() => {item.roomType === "PROTECTED" ? handleEntringRoom(item.id, item.roomType === "PROTECTED") : handleJoinRoom(item.id, item.roomType)}} />
										))
									}
								</>
							)
						}
					</Box>
				</DrawerBody>

				<DrawerFooter>
				</DrawerFooter>
			</DrawerContent>
			{ openModal && <RoomPasswordModal isOpen={_passDisclosure.isOpen} onClose={_passDisclosure.onClose} onOpen={_passDisclosure.onOpen} submit={() => requestJoinRoom()} onChange={(v) => setRoomPassword(v)} /> }
			{ selectedRoomID && openChat && <Chat chatId={selectedRoomID} isOpen={_chat.isOpen} onClose={_chat.onClose} /> }
			{ _createRoomModal.isOpen && <CreateRoom updateRooms={(room: {name: string, roomType: string}) => setRooms([room, ...rooms])} isOpen={_createRoomModal.isOpen} onClose={_createRoomModal.onClose} /> }
		</Drawer>
	)
}
