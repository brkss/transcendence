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

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const _tmp = [
	{
		name: "Chat 1",
		isProtected: true,
	},
	{
		name: "Chat 2",
		isProtected: false,
	}
]

export const ChatDrawer: React.FC<Props> = ({isOpen, onClose}) => {

	const [openCreateModal, setOpenCreateModal] = React.useState(false);
	const [openModal, setOpenModal] = React.useState(false);
	const [openChat, setOpenChat] = React.useState(false);
	const _passDisclosure = useDisclosure(); 
	const _createRoomModal = useDisclosure();
	const _chat = useDisclosure();

	const handleEntringRoom = (isProtected: boolean) => {
		if(isProtected){
			setOpenModal(true);
			_passDisclosure.onOpen();
		}else {
			setOpenChat(true);
			_chat.onOpen();
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
							_tmp.map((item, key) => (
								<ChatBox key={key} name={item.name} isProctected={item.isProtected}  enter={() => handleEntringRoom(item.isProtected)} />
							))
						}
					</Box>
				</DrawerBody>

				<DrawerFooter>
				</DrawerFooter>
			</DrawerContent>
			{ openModal && <RoomPasswordModal isOpen={_passDisclosure.isOpen} onClose={_passDisclosure.onClose} onOpen={_passDisclosure.onOpen} /> }
			{ openChat && <Chat isOpen={_chat.isOpen} onClose={_chat.onClose} /> }
			{ _createRoomModal.isOpen && <CreateRoom isOpen={_createRoomModal.isOpen} onClose={_createRoomModal.onClose} /> }
		</Drawer>
	)
}
