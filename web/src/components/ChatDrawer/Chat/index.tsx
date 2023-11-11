import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, Flex, Box, Text, Button, Input, DrawerCloseButton, useDisclosure } from '@chakra-ui/react';
import { ChatFooter } from './Footer';
import { ChatHeader } from './Header';
import { ChatMessages } from './Messages'
import { ChatSettings } from './Settings';
import { API_URL } from '@/utils/constants';
import { getAccessToken } from '@/utils/token';
import { io } from 'socket.io-client';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	chatId: number;
}

export const Chat : React.FC<Props> = ({isOpen, onClose, chatId}) => {

	const _settings = useDisclosure();
	const [messages, setMessages] = React.useState<any>([
		/*{ from: "computer", text: "Hi, My Name is HoneyChat" },
		{ from: "me", text: "Hey there" },
		{ from: "me", text: "Myself Ferin Patel" },
		{
			from: "computer",
			text: "Nice to meet you. You can send me message and i'll reply you with same message.",
		},*/
	]);
	const [inputMessage, setInputMessage] = React.useState("");
	const handleSendMessage = () => {
		if (!inputMessage.trim().length) {
			return;
		}
		const data = inputMessage;

		setMessages((old: any) => [...old, { from: "me", text: data }]);
		setInputMessage("");

		setTimeout(() => {
			setMessages((old: any) => [...old, { from: "computer", text: data }]);
		}, 1000);
	};

	let socket = io(API_URL, {
		extraHeaders: {
			Authorization: getAccessToken()
		}
	})

	React.useEffect(() => {

		socket.on('connect', () => {
			console.log("socket connected");
		})
		
		socket.connect()
		socket.on("users", (data) => {
			console.log("users chat data : ", data);
		});

		socket.on("history", (data) => {
			console.log("history chat data : ", data);
		});
		

		socket.emit("joinChat")
		return () => {
			socket.off("connect")
			socket.off("users")
			socket.off("history")
			socket.disconnect()
		}

	}, [socket])
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
						<ChatHeader openSettings={_settings.onOpen} />
						<ChatMessages messages={messages} />
						<ChatFooter
							inputMessage={inputMessage}
							setInputMessage={setInputMessage}
							handleSendMessage={handleSendMessage}
						/>
					</Flex>
				</Flex>
			</DrawerContent>
			{ _settings.isOpen && <ChatSettings roomId={chatId} isOpen={_settings.isOpen} onClose={_settings.onClose} /> }
		</Drawer>
	)
}
