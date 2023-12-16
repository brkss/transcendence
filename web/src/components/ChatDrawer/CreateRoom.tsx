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
	useToast,
	useDisclosure
} from '@chakra-ui/react'
import { Error } from '../General'
import { CreateRoomInput } from '../../utils/types';
import { createRoomService } from '../../utils/services';
import { SelectPrivateRoomMemebers, SelectedMembers } from './SelectPrivateRoomMembers';

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


	const _checkFriendsDrawer = useDisclosure();
	const toast = useToast();
	const [selectedMembers, setSelectedMembers] = React.useState<SelectedMembers[]>([]);
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
		if(!form || !form.roomName || !roomType || (roomType === "PROTECTED" && !form.roomPassword) || (roomType === "PRIVATE" && selectedMembers.length === 0)){
			setError("Invalid data !");
			return;
		}
		setError("")
		console.log("form : ", form, roomType, selectedMembers);
		const data : CreateRoomInput = {
			roomName: form.roomName,
			roomType: roomType,
			password: form.roomPassword,
			mebers_id: selectedMembers.map(m => m.id)
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
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
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
						{
							roomType === "PRIVATE" && 
							(<Button onClick={() => _checkFriendsDrawer.onOpen()} size={'sm'} mt={'20px'}>Invite Friends</Button>)
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
			{ _checkFriendsDrawer.isOpen && <SelectPrivateRoomMemebers done={(selected) => {setSelectedMembers(selected); _checkFriendsDrawer.onClose()}} onClose={_checkFriendsDrawer.onClose} isOpen={_checkFriendsDrawer.isOpen} /> }
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
