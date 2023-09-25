import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, Flex, Box, Text, Button, Input } from '@chakra-ui/react';
import { ChatFooter } from './Footer';
import { ChatHeader } from './Header';
import { ChatMessages } from './Messages'

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const Chat : React.FC<Props> = ({isOpen, onClose}) => {

	const [messages, setMessages] = React.useState([
		{ from: "computer", text: "Hi, My Name is HoneyChat" },
		{ from: "me", text: "Hey there" },
		{ from: "me", text: "Myself Ferin Patel" },
		{
			from: "computer",
			text: "Nice to meet you. You can send me message and i'll reply you with same message.",
		},
	]);
	const [inputMessage, setInputMessage] = React.useState("");

	const handleSendMessage = () => {
		if (!inputMessage.trim().length) {
			return;
		}
		const data = inputMessage;

		setMessages((old) => [...old, { from: "me", text: data }]);
		setInputMessage("");

		setTimeout(() => {
			setMessages((old) => [...old, { from: "computer", text: data }]);
		}, 1000);
	};

	return (

		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size={'md'}
		>
			<DrawerOverlay />
			<DrawerContent className='afr'	>
				<Flex w="100%" h="100%" justify="center" align="center" zIndex={9999}>
					<Flex w="100%" h="100%" flexDir="column">
						<ChatHeader />
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
