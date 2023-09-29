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
	Center,
    FormControl,
    FormLabel,
	Input,
    Button
} from '@chakra-ui/react'

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const SettingsDrawer : React.FC<Props> = ({isOpen, onClose}) => {

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
					<Heading>Settings</Heading>
					<Center h={'100%'}>
						<Box>
							<FormControl>
								<FormLabel fontSize={'15px'} fontWeight={'bold'} mb={'5px'}>Name</FormLabel>
								<Input variant={'filled'} />
							</FormControl>
							<FormControl>
								<FormLabel>Username</FormLabel>
								<Input variant={'filled'} />
							</FormControl>
						</Box>						
					</Center>
					
				</DrawerBody>

				<DrawerFooter>
					<Button mr={'10px'}>Save</Button>
					<Button variant={'ghost'}>Cancel</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
