import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, Flex, Box, Text, Button, Input, DrawerCloseButton, useDisclosure, useToast } from '@chakra-ui/react';
import { ChatFooter } from './Footer';
import { ChatHeader } from './Header';
import { ChatMessages } from './Messages'
import { API_URL } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { io } from 'socket.io-client';
import decode from 'jwt-decode';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	userId: number;
}

export const PrivateChat : React.FC<Props> = ({isOpen, onClose, userId }) => {

	// init socket 
	let socket = React.useMemo(() => io(API_URL, {
		extraHeaders: {
			Authorization: getAccessToken()
		}
	}), []); 

	const toast = useToast();
	const _settings = useDisclosure();
	const [messages, setMessages] = React.useState<any>([]);

	const [inputMessage, setInputMessage] = React.useState("");
	
	const handleSendMessage = () => {
		if (!inputMessage.trim().length) {
			return;
		}
		const data = inputMessage;
		/*
		socket.emit("chatMessage", {
			room_id: chatId,
			message: data
		});
		*/
		setMessages((old: any) => [...old, { from: "me", text: data }]);
		setInputMessage("");
	};

	const handleRecievingMessage = (data: { user: string, message: string, time: string }) => {
		console.log("recieved message : ", data, messages);
		setMessages((old: any) => [...old, { from: data.user, text: data.message}])
	}

	
	React.useEffect(() => {

		socket.on('connect', () => {
			console.log("socket connected");
		})

		setMessages([]);
		
		socket.connect()
		
		socket.on("message", handleRecievingMessage);

		socket.on("Error", (data) => {
			console.log("got new error : ", data);
		});

		socket.on("success", (data) => {
			console.log("got success : ", data);
		});
		

		//socket.emit("joinChat", {room_id: chatId, roomType: "PUBLIC"});
		return () => {
			socket.off("connect")
			socket.off("message")
			socket.off("Error")
			socket.off("success")
			socket.disconnect()
		}
	}, [socket, userId])


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
						<ChatHeader name={"Brahim Berkasse" + userId} />
						
						<ChatMessages messages={messages} />
						<ChatFooter
							inputMessage={inputMessage}
							setInputMessage={setInputMessage}
							handleSendMessage={handleSendMessage}
						/>
					</Flex>
				</Flex>
			</DrawerContent>
		</Drawer>
	)
}
