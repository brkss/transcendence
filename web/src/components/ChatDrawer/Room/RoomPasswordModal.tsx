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
	Input,
	Box
} from '@chakra-ui/react'

interface Props {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onChange: (v: string) => void;
	submit: () => void;
}

export const RoomPasswordModal : React.FC<Props> = ({isOpen, onClose, submit, onChange}) => {



	return (
		<Box m={'20px'}>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent m={'20px'}>
					<ModalHeader>Password Required</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl>
							<FormLabel>please enter room password </FormLabel>
							<Input  placeholder='Password' variant={'filled'} type={'password'} onChange={(e) => onChange(e.currentTarget.value)} />
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button size={'sm'} colorScheme='blackAlpha' variant={'outline'} mr={3} onClick={() => {submit(); onClose()}}>
							Submit Password	
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	)
}
