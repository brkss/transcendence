import React, { useEffect, useRef } from "react";
import { Box, Avatar, Flex, Text } from "@chakra-ui/react";

interface IMessage {
	text: string;
	from: string;
}

interface Props {
	messages: IMessage[];
}

/*
const AlwaysScrollToBottom = () => {
	const elementRef = useRef();
	if(!elementRef.current) return;
	useEffect(() => elementRef.current!.scrollIntoView());

	return <Box ref={elementRef} />;
};
*/

export const ChatMessages : React.FC<Props> = ({messages}) => {

	const containerRef = React.useRef<any>(null);
	React.useEffect(() => {
		if(containerRef.current){
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
		
	}, [messages]);

	
	const simulateScroll = (event: React.WheelEvent<HTMLDivElement>) => {
		//event.preventDefault(); // Prevent the default wheel behavior
		if(!containerRef.current)
			return;
		// Adjust the scroll amount based on the wheel delta
		const scrollAmount = 20; // You can adjust this value
		const messagesBox = document.getElementById('messagesBox');
		
		if(event.deltaY > 0){
			console.log(" > 0");
		}else {
			console.log(" < 0");
		}
		
		// Simulate vertical scrolling
		containerRef.current.scrollTop += event.deltaY > 0 ? scrollAmount : -scrollAmount;
	  }

	return (
		<Flex ref={containerRef} grow="1" w="100%" h="100%" overflowY="scroll" flexDirection="column" p="20px" onWheel={simulateScroll}>
			{messages.map((item, index) => {
				if (item.from === "PongBot") {
					return (
						<Box w={'100%'} textAlign={'center'}>
							<Text fontSize={'12px'} opacity={.8}>{item.text}</Text>
						</Box>
					)
				} else if (item.from === "me") {
					return (
						<Flex key={index} w="100%" justify="flex-end">
							<Flex
								bg="black"
								color="white"
								w="fit-content"
								wordBreak={'break-word'}
								maxW="350px"
								my="1"
								p="5px 12px"
								rounded={'15px'}
								borderBottomRightRadius={'4px'}
								>
								<Text>{item.text}</Text>
							</Flex>
						</Flex>
						);
				} else if(item.from && item.text	) {
					return (
						<Flex key={index} w="100%" alignItems={'center'}>
							<Avatar
								mr={'5px'}
								name="Computer"
								wordBreak={'break-word'}
								size={'sm'}
								src="data:image/jpeg;base64,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"
								bg="blue.300"
							></Avatar>
							<Flex
								bg="gray.100"
								color="black"
								w="fit-content"
								maxW="350px"
								wordBreak={'break-word'}
								my="1"
								p="5px 12px"
								rounded={'15px'}
								borderBottomLeftRadius={'4px'}
								>
								<Text>{item.text}</Text>
							</Flex>
						</Flex>
						);
				}
			})}
			{/*<AlwaysScrollToBottom />*/}
		</Flex>
	)
}
