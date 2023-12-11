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
	FormLabel,
	Box,
	Text,
	useToast
} from '@chakra-ui/react'
import { Error } from '../General'
import { CreateRoomInput } from '../../utils/types';
import { createRoomService } from '../../utils/services';


const types = [
	"PUBLIC",
	"PRIVATE",
	"PROTECTED"
]

interface Props {
	isOpen: boolean;
	onClose: () => void;
	updateRooms: (room: { id: number, name: string, roomType: string }) => void;
}

export const CreateRoom : React.FC<Props> = ({isOpen, onClose, updateRooms}) => {


	const toast = useToast();
	const [form, setForm] = React.useState<any>({});
	const [error, setError] = React.useState("");
	const [roomType, setRoomType] = React.useState(types[0]);
	//const [loading, setLoading] = React.useState(false);

	const handleForm = (id: string, txt: string) => {
		setForm({
			...form,
			[id]: txt
		})
	}

	const createRoom = async () => {
		if(!form || !form.roomName || !roomType || (roomType === "PROTECTED" && !form.roomPassword)){
			setError("Invalid data !");
			return;
		}
		setError("")
		console.log("form : ", form, roomType);
		const data : CreateRoomInput = {
			roomName: form.roomName,
			roomType: roomType,
			password: form.roomPassword 
		}
		createRoomService(data).then(response => {
			console.log("create room data : ", response);
			updateRooms({ id: response.id, name: form.roomName, roomType: roomType });
			onClose();	
			toast({
				title: "chat room created successfuly",
				duration: 9000,
				isClosable: true,
				status: "success"
			})
		}).catch(e => {
			console.log("creating room error : ", e);
			toast({
				title: "something went wrong creating room chat",
				duration: 9000,
				isClosable: true,
				status: "error"
			})
			onClose();
		});
		
	}

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create new room</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{
							error && <Error err={error} />
						}
						<FormControl>
						  <FormLabel fontSize={'14px'} fontWeight={'bold'} >Room Name</FormLabel>
						  <Input onChange={(e) => handleForm("roomName", e.currentTarget.value)} placeholder='Room name' variant={'filled'} />
						</FormControl>
						{ roomType === "PROTECTED" &&
							<FormControl mt={'20px'}>
							  <FormLabel fontSize={'14px'} fontWeight={'bold'}>Room Password </FormLabel>
							  <Input  onChange={(e) => handleForm("roomPassword", e.currentTarget.value)} placeholder='Password' type={'password'} variant={'filled'} />
							</FormControl>
						}
					
						<FormControl mt={'20px'}>
							<RoomType changeType={(val) => setRoomType(val)} selected={roomType} />
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button mr={3} variant={'ghost'} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme='green' onClick={createRoom}>Create Room</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

interface RoomTypeProps {
	changeType: (val: string) => void;
	selected: string
}

const RoomType : React.FC<RoomTypeProps> = ({changeType, selected}) => {

	return (
		<Box>
			<Box display={'flex'}>
			{
				types.map((type, key) => (
					<Box key={key} p={'10px 15px'} mr={'10px'} cursor={'pointer'} bg={type === selected ? "green.100" : '#dfdfdf'} rounded={'8px'} fontWeight={'bold'} fontSize={'12px'} onClick={() => changeType(type)}>
						<Text>{type}</Text>
					</Box>
				))
			}
			</Box>
		</Box>
	)
}
