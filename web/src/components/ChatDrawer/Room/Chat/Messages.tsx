import React, { useEffect, useRef } from "react";
import { Box, Avatar, Flex, Text } from "@chakra-ui/react";

interface IMessage {
	text: string;
	from: string;
	avatar?: string;
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
			//console.log(" > 0");
		}else {
			//console.log(" < 0");
		}
		
		// Simulate vertical scrolling
		containerRef.current.scrollTop += event.deltaY > 0 ? scrollAmount : -scrollAmount;
	  }

	return (
		<Flex ref={containerRef} grow="1" w="100%" h="100%" overflowY="scroll" flexDirection="column" p="20px" onWheel={simulateScroll}>
			{messages.map((item, index) => {
				if (item.from === "PongBot") {
					return (
						<Box w={'100%'} textAlign={'center'} key={index * Math.random()}>
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
								src={item.avatar || ""}
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
