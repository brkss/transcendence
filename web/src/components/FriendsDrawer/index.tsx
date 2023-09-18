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
import { RequestItem } from './RequestItem'

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
					<Box pb={'25px'} mb={'10px'} borderBottom={'1px dotted #c5c4c4'}>
						<RequestItem />
					</Box>
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
