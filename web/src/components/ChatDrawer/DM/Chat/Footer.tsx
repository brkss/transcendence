import React from "react";
import { Flex, Input, Button } from "@chakra-ui/react";
import { AiOutlineSend } from 'react-icons/ai'

interface Props {
	inputMessage: string, 
	setInputMessage: (msg: string) => void; 
	handleSendMessage: () => void; 
}

export const ChatFooter : React.FC<Props> = ({inputMessage, setInputMessage, handleSendMessage }) => {



	return (
		<Flex w="100%" mt="5" p={'20px'}>
			<Input
				placeholder="Type Something..."
				border="none"
				borderRadius="none"
				_focus={{
					border: "none",
					outline: "none",
					boxShadow:  "none"
				}}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						handleSendMessage();
					}
				}}
				value={inputMessage}
				_focusVisible={{
					background: "#edf2f6",
				}}
				variant={'filled'}
				rounded={'50px'}
				onChange={(e) => setInputMessage(e.target.value)}
			/>
			<Button
				bg="transparent"
				borderRadius="none"
				transition={'.3s'}
				_hover={{
					background: "transparent",
					opacity: .8,
					transition: ".3s"
				}}
				disabled={inputMessage.trim().length <= 0}
				onClick={handleSendMessage}
				>
				<AiOutlineSend size={'22px'} />
			</Button>
		</Flex>
	)
}
