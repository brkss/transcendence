import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, Flex, Box, Text, Button, Input, DrawerCloseButton, useDisclosure, useToast } from '@chakra-ui/react';
import { ChatFooter } from './Footer';
import { ChatHeader } from './Header';
import { ChatMessages } from './Messages'
import { ChatSettings } from './Settings';
import { API_URL, API_URL_BASE } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { io } from 'socket.io-client';
import decode from 'jwt-decode';
import { blockedUsers, getChatHistory, getFriends } from '@/utils/services';
import jwtDecode from 'jwt-decode';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	chatId: number;
	removeRoom: (id: number) => void;
	name: string;
	blocked: any[];
}

export const Chat : React.FC<Props> = ({isOpen, onClose, chatId, removeRoom, name, blocked}) => {

	// init socket 
	let socket = React.useMemo(() => io(API_URL_BASE, {
		extraHeaders: {
			Authorization: getAccessToken()
		}
	}), []); 
	

	const toast = useToast();
	const _settings = useDisclosure();
	const [messages, setMessages] = React.useState<any>([]);
	//const [blocked, setBlocked] = React.useState<any>([]);
	const [inputMessage, setInputMessage] = React.useState("");

	
	
	const handleSendMessage = () => {
		if (!inputMessage.trim().length) {
			return;
		}
		const data = inputMessage;
		//console.log("sending message : ", { room_id: chatId, message: data });
		socket.emit("chatMessage", {
			room_id: chatId,
			message: data
		});
		setMessages((old: any) => [...old, { from: "me", text: data }]);
		setInputMessage("");
	};

	const handleRecievingMessage = (data: { uid: number, user: string, message: string, time: string, avatar: string }) => {
		//console.log("recieved message : ", data, messages, blocked);
		if(!blocked.find((x:any) => x.blockee === data.uid))
			setMessages((old:any) => [...old, { from: data.user, text: data.message, avatar: data.avatar}])
	}

	const fetchChatHostory = async () => {
		getChatHistory(chatId).then(response => {
			const me = jwtDecode(getAccessToken()) as any;
			if(me){
				
				const {username} = me;
				let filtred = [];
				for(let i = 0; i < response.length; i++){
					if(!blocked.find(x => x.blockee === response[i].sender.id)){
						filtred.push(response[i]);
					}
				}
				setMessages([...messages, ...filtred.map((msg: any) => (
					{ from: msg.sender.username === username ? "me" : msg.sender.username, text: msg.message, avatar: msg.sender.avatar }
				))]);
			}
		}).catch(e => {
			//console.log("something went getting chat history : ", e);
		}); 
	}
	
	React.useEffect(() => {
		socket.on('connect', () => {
			//console.log("socket connected");
			//console.log("join data : ",  {room_id: chatId, roomType: "PUBLIC"});
			socket.emit("joinChat", {room_id: chatId, roomType: "PUBLIC"});
			
		})

		fetchChatHostory();
		

		setMessages([]);
		
		socket.connect()
		
		socket.on("message", handleRecievingMessage);
		socket.on("Error", (data) => {
			toast({
				status: 'error',
				duration: 9000,
				isClosable: true,
				title: data
			})
		});

		socket.on("success", (data) => {
			//console.log("got success : ", data);
		});
		
		

		return () => {
			socket.off("connect")
			socket.off("message")
			socket.off("Error")
			socket.off("success")
			socket.disconnect()
		}
	}, [socket, chatId])

	

	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size={'md'}
		>
			<DrawerOverlay />
			<DrawerContent className='afr'	>
				<Flex w="100%" h={{base: "calc(100% - 81px)", md: "100%"}} justify="center" align="center" zIndex={9999}>
				
					<Flex w="100%" h="100%" flexDir="column">
						
							<ChatHeader roomName={name} openSettings={_settings.onOpen} />
							<ChatMessages messages={messages} />
							<ChatFooter
								inputMessage={inputMessage}
								setInputMessage={setInputMessage}
								handleSendMessage={handleSendMessage}
							/>
							
					</Flex>
				</Flex>
			</DrawerContent>
			{ _settings.isOpen && <ChatSettings closeAll={() => {onClose(); removeRoom(chatId);}} roomId={chatId} isOpen={_settings.isOpen} onClose={_settings.onClose} /> }
		</Drawer>
	)
}
