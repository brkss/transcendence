import React from 'react';
import { 
	Box,
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
    Flex
} from '@chakra-ui/react';
import { Avatar } from '../../Avatar'
import { AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineClockCircle } from 'react-icons/ai';
import { API_URL } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { io } from 'socket.io-client';
import { deleteRoomService, getRoomMembers } from '@/utils/services';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	roomId: number 
}

export const ChatSettings : React.FC<Props> = ({isOpen, onClose, roomId}) => {
	
	const [members, setMembers] = React.useState([]);

	React.useEffect(() => {
		(async () => {
			const response = await getRoomMembers(roomId);
			console.log("room members : ", response);
		})();
	});

	const handleDeleteRoom = async () => {
		const response = await deleteRoomService(roomId);
		console.log('delete room response : ', response);
	}

	const handleBanUser = () => {

	}

	const handleMuteUser = () => {

	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={'10px'}>
				<Text fontWeight={'bold'}>General</Text>
				<Flex m={'10px 0'}>
					<Button size={'sm'} colorScheme='red' variant={'outline'} mr={'10px'}>Leave Room</Button>
					<Button size={'sm'} colorScheme='red' variant={'outline'} mr={'10px'}>Delete Room</Button>
				</Flex>
				<Text fontWeight={'bold'}>Members</Text>
				<Flex alignItems={'center'} justifyContent={'space-between'} p={'10px'} m={'10px 0'} bg={'#f0f0f0'} rounded={'14px'}>
					<Flex alignItems={'center'}>
						<Avatar d={'40px'} />
						<Text fontWeight={'bold'} ml={'10px'}>@avocado</Text>
					</Flex>
					<Flex alignItems={'center'}>
						<Button variant={'ghost'} p={0}>
							<AiOutlineUserDelete />
						</Button>
						<Button variant={'ghost'} p={0}>
							<AiOutlineClockCircle />
						</Button>
						<Button variant={'ghost'} p={0}>
							<AiOutlineUserAdd />
						</Button>
					</Flex>
				</Flex>
				
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blackAlpha' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
	)
}
