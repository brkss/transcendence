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
	Text
} from '@chakra-ui/react'
import { io } from 'socket.io-client';
import { API_URL } from '@/utils/constants';
import { Error } from '../General'
import { getAccessToken } from '@/utils/token';


const types = [
	"PUBLIC",
	"PRIVATE",
	"PROTECTED"
]

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateRoom : React.FC<Props> = ({isOpen, onClose}) => {

	let socket = io(API_URL, {
		extraHeaders: {
			Authorization: getAccessToken()
		}
	})
	const [form, setForm] = React.useState<any>({});
	const [error, setError] = React.useState("");
	const [roomType, setRoomType] = React.useState(types[0]);
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		//const socket = io(API_URL);
		socket.connect()
		socket.on("connect", () => {
			console.log("socket connected")
		})

		socket.on("Error", (err) => {
			console.log("error: ", err)
			setError(err.Error);
		})

		socket.on("RoomCreated", (msg) => {
			onClose();
			console.log("success : ", msg);
		});

		return () => {
			socket.disconnect()
			console.log("socket disconnect !");
		}
	})

	const handleForm = (id: string, txt: string) => {
		setForm({
			...form,
			[id]: txt
		})
	}

	const createRoom = () => {
		if(!form || !form.roomName || !roomType || (roomType === "PROTECTED" && !form.roomPassword)){
			setError("Invalid data !");
			return;
		}
		setError("")
		console.log("form : ", form, roomType);
		console.log("------- sending socket")
		socket.emit("newRoom", {
			roomName: form.roomName,
			password: form.roomPassword,
			roomType: roomType
		})
		
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
