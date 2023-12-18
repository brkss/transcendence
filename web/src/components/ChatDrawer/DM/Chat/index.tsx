import React, { useId } from 'react';
import { Drawer, DrawerOverlay, DrawerContent, Flex, Box, Text, Button, Input, DrawerCloseButton, useDisclosure, useToast } from '@chakra-ui/react';
import { ChatFooter } from './Footer';
import { ChatHeader } from './Header';
import { ChatMessages } from './Messages'
import { API_URL } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { io } from 'socket.io-client';
import decode from 'jwt-decode';
import { getUserById, userChatHistory } from '@/utils/services';
import { Loading } from '@/components/General';
import jwtDecode from 'jwt-decode';

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
	const [user, setUser] = React.useState<any>();

	const getUser = () => {
		getUserById(userId).then(response => {
			setUser(response);
		}).catch(e => {
			console.log("something went wrong getting user : ", e);
			onClose();
		})
	}
	
	const handleSendMessage = () => {
		if (!inputMessage.trim().length) {
			return;
		}
		const data = inputMessage;
		
		socket.emit("privateMessage", {
			userId,
			message: data
		});
		
		setMessages((old: any) => [...old, { from: "me", text: data }]);
		setInputMessage("");
	};

	const handleRecievingMessage = (data: { user: string, message: string, time: string }) => {
		console.log("recieved message : ", data, messages);
		setMessages((old: any) => [...old, { from: data.user, text: data.message}])
	}

	const fetchChatHistory = () => {
		userChatHistory(userId).then(response => {
			const me = jwtDecode(getAccessToken()) as any;
			if(me){
				setMessages([...messages, ...response.map((msg: any) => (
					{ from: msg.sender.username === me.username ? "me" : msg.sender.username, text: msg.message }
				))])
			}
			//console.log("chat hostory dm response : ", response);
		}).catch(e => {
			console.log("getting chat history error : ", e);
		}) 
	}

	
	React.useEffect(() => {

		socket.on('connect', () => {
			console.log("socket connected");
		});

		getUser();
		fetchChatHistory();

		setMessages([]);
		
		socket.connect()
		
		socket.on("privateMessage", handleRecievingMessage);

		socket.on("Error", (data) => {
			toast({
				status: 'error',
				duration: 9000,
				isClosable: true,
				title: data
			})
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

	const handleInvteToGame = (uid: number) => {
		
		socket.emit("inviteFriend", {
			fid: uid
		})
	}


	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size={'md'}
		>
			<DrawerOverlay />
			<DrawerContent className='afr'	>
				{ user ?
					(<Flex w="100%" h={{base: "calc(100% - 81px)", md: "100%"}} justify="center" align="center" zIndex={9999}>
						<Flex w="100%" h="100%" flexDir="column">
							<ChatHeader invite={() => handleInvteToGame(user.id)} username={user.username} name={user.fullName} image={user.avatar} />
							
							<ChatMessages messages={messages} />
							<ChatFooter
								inputMessage={inputMessage}
								setInputMessage={setInputMessage}
								handleSendMessage={handleSendMessage}
							/>
						</Flex>
					</Flex>) :
					<Loading />
				}
			</DrawerContent>
		</Drawer>
	)
}
