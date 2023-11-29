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
	Text,
	useToast,
	Tabs,
	TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react'
import {  AiOutlinePlusCircle } from 'react-icons/ai';
import { CreateRoom } from './CreateRoom'
import { ChatRooms } from './Room';
import { Dms } from './DM';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const ChatDrawer: React.FC<Props> = ({isOpen, onClose}) => {	
	
	const _createRoomModal = useDisclosure();

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
					
					<Box>
						<Tabs mt={'20px'} variant='soft-rounded' colorScheme='green'>
							<TabList>
								<Tab>Chat Rooms</Tab>
								<Tab>Private Messages</Tab>
							</TabList>
							<TabPanels>
								<TabPanel p={0}>
									<ChatRooms />
								</TabPanel>
								<TabPanel p={0}>
									<Dms />	
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Box>	
				</DrawerBody>

				<DrawerFooter>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
