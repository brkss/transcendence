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
    useDisclosure
} from '@chakra-ui/react'
import { ChatBox } from './Item';
import { RoomPasswordModal } from './RoomPasswordModal';
import { Chat } from './Chat'

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

	const [openModal, setOpenModal] = React.useState(false);
	const [openChat, setOpenChat] = React.useState(false);
	const _passDisclosure = useDisclosure(); 
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
					<Heading>Chat</Heading>
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
		</Drawer>
	)
}
