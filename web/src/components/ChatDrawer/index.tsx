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
	const _passDisclosure = useDisclosure(); 

	const handleEntringRoom = (isProtected: boolean) => {
		if(isProtected){
			setOpenModal(true);
			_passDisclosure.onOpen();
		}
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
		</Drawer>
	)
}
