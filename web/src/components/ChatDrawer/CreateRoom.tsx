import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Input,
	Button,
	FormControl,
	FormLabel
} from '@chakra-ui/react'


interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateRoom : React.FC<Props> = ({isOpen, onClose}) => {


	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create new room</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl>
						  <FormLabel fontSize={'14px'} fontWeight={'bold'} >Room Name</FormLabel>
						  <Input  placeholder='Room name' variant={'filled'} />
						</FormControl>
						<FormControl mt={'20px'}>
						  <FormLabel fontSize={'14px'} fontWeight={'bold'}>Room Password (optional)</FormLabel>
						  <Input  placeholder='Password' type={'password'} variant={'filled'} />
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button mr={3} variant={'ghost'} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme='green'>Create Room</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
