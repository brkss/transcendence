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

interface Props {
	isOpen: boolean;
	onClose: () => void;
}


export const FriendsDrawer : React.FC<Props> = ({isOpen, onClose}) => {


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
					<Box>
						<FriendBox />
						<FriendBox />
						<FriendBox />
						<FriendBox />
						<FriendBox />
						<FriendBox />
					</Box>
				</DrawerBody>

				<DrawerFooter>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
