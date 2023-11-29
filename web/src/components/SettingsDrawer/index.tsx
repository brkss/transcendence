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
    Button,
	Grid,
	GridItem,
} from '@chakra-ui/react'
import { Avatar } from '../Avatar';

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
					<Heading>Edit Profile</Heading>
					<Center h={'100%'}>
						<Box w={'100%'}>
							<Center h={'200px'} textAlign={'center'}>
								<Avatar />
							</Center>
							<Grid templateColumns={'repeat(12, 1fr)'} gap={3}>
								<GridItem colSpan={{md: 12, base: 12}}>
									<FormControl>
										<FormLabel fontSize={'15px'} fontWeight={'bold'} mb={'5px'}>Name</FormLabel>
										<Input variant={'filled'} />
									</FormControl>
								</GridItem>
								<GridItem colSpan={{md: 12, base: 12}}>
									<FormControl mt={'0'}>
										<FormLabel fontSize={'15px'} fontWeight={'bold'} mb={'5px'}>Username</FormLabel>
										<Input variant={'filled'} />
									</FormControl>
								</GridItem>
							</Grid>
							
							
							
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
