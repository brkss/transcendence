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
    useDisclosure,
    Button,
	Text,
	useToast
} from '@chakra-ui/react'
import { PrivateChat } from './Chat';
import { DMBox } from './Item';
import { getUserChats } from '@/utils/services';

export const Dms : React.FC = () => {

    const [dms, setDms] = React.useState<any[]>([
        //{name: "brahim", username: "brkss", image: ""},
    ]);
    const [selectedUserId, setSelectedUserId] = React.useState(-1);
    const _chat = useDisclosure();

    React.useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = () => {
        getUserChats().then(response => {
            console.log("get chats response : ", response);
            setDms(response);
        }).catch(e => {
            console.log("something wrong geting chats : ", e);
        })
    }

    const handleEnterChat = (uid: number) => {
        setSelectedUserId(uid);
        _chat.onOpen();
    }

    return (
        <>
            <Box display={'flex'} justifyContent={'space-between'} mt={'20px'} alignItems={'center'}>
				<Heading>Private Messages</Heading>
			</Box>
			<Box>
                {
                    dms.map((item, key) => (
                        <Box key={key}>
                            <DMBox name={item.fullName} username={item.username} image={item.avatar} enterChat={() => handleEnterChat(item.id)} />
                            {/*<ChatBox  name={item.name} type={item.roomType}  enter={() => openChatRoom(item.id)} />*/}
                            <hr style={{marginTop: '10px', display: 'none'}} />	
                        </Box>
                    ))
                }
			</Box>
			
			{ selectedUserId > 0 && <PrivateChat userId={selectedUserId}  isOpen={_chat.isOpen} onClose={_chat.onClose} /> }
        </>
    )
}