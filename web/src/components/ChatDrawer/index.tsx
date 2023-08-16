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
import { ChatBox } from './Item';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}


export const ChatDrawer: React.FC<Props> = ({isOpen, onClose}) => {


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
						<ChatBox />
						<ChatBox />
						<ChatBox />
						<ChatBox />
						<ChatBox />
					</Box>
				</DrawerBody>

				<DrawerFooter>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
