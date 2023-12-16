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
    Text,
    Box,
    Stack,
    Center
} from '@chakra-ui/react'
import { Avatar } from '../Avatar';
import { getFriends } from '@/utils/services';


export interface SelectedMembers {
    id: number,
    avatar: string,
    username: string,
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    done: (selected: SelectedMembers[]) => void;
}


export const SelectPrivateRoomMemebers : React.FC<Props> = ({isOpen, onClose, done}) => {

    const [friends, setFriends] = React.useState<any[]>([]);
    const [selected, setSelected] = React.useState<SelectedMembers[]>([]);

    const handleGetFriends = () => {
        getFriends().then(response => {
            console.log("friends : ", response);
            setFriends(response);
        }).catch(e => {
            console.log("something went wrong : ", e);
        })
    }

    const handleSelect = (id: number, avatar: string, username: string) => {
        const index = selected.findIndex(x => x.id === id)
        if(index > -1){
            const tmp = [...selected];
            tmp.splice(index, 1);
            setSelected([...tmp]);
        }else {
            setSelected([...selected, { id: id, username: username, avatar: avatar }]);
        }
    }

    React.useEffect(() => {
        handleGetFriends();
    }, [isOpen]);


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select Room Members</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    
                        <Box>
                            {
                                friends.map((f, key) => (
                                    <CheckFriend image={f.avatar} username={f.username} isChecked={!!selected.find(x => x.id === f.id)} select={() => handleSelect(f.id, f.username, f.avatar)} />
                                ))
                            }
                        </Box>
                    </ModalBody>
        
                    <ModalFooter>
                    <Button size={'sm'} mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size={'sm'} colorScheme='green' variant='outline' onClick={() => done(selected)}>Done</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

interface CheckFriendProps {
    isChecked: boolean;
    image: string;
    username: string;
    select: () => void;
}

const CheckFriend : React.FC<CheckFriendProps> = ({isChecked, username, image, select}) => {

    return (
        <Box border={isChecked ? '2px dotted #51922652' : '2px dotted transparent'} onClick={select} cursor={'pointer'} bg={isChecked ? '#51922614' : 'white'} _hover={{backgroundColor: '#e9e9e9', transition: '.3s'}} transition={'.3s'} rounded={'9px'} p={'5px'} mt={'10px'}>
            <Stack direction={['column', 'row']} spacing={'10px'}>
				<Avatar d={'50px'} src={image} />
				<Box>
					<Text fontWeight={'bold'}>@{username}</Text>
                    <Text bg={isChecked ? 'green.100' : 'gray.100'} rounded={'4px'} fontWeight={'bold'} fontSize={'13px'} p={'1px 6px'} display={'inline-block'}>{isChecked ? 'selected' : 'not selected'}</Text>
				</Box>
			</Stack>
        </Box>
    )

}