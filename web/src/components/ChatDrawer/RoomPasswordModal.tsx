import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	FormLabel,
	FormControl,
	Input
} from '@chakra-ui/react'

interface Props {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const RoomPasswordModal : React.FC<Props> = ({isOpen, onClose, onOpen}) => {



	return (
		<>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Password Required</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl>
							<FormLabel>please enter room's password </FormLabel>
							<Input  placeholder='Password' variant={'filled'} type={'password'} />
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button size={'sm'} colorScheme='blackAlpha' variant={'outline'} mr={3}>
							Access the room	
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
