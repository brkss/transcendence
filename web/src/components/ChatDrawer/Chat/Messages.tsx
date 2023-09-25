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



	return (
		<Flex w="100%" h="100%" overflowY="scroll" flexDirection="column" p="20px">
			{messages.map((item, index) => {
				if (item.from === "me") {
					return (
						<Flex key={index} w="100%" justify="flex-end">
							<Flex
								bg="black"
								color="white"
								minW="100px"
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
				} else {
					return (
						<Flex key={index} w="100%" alignItems={'center'}>
							<Avatar
								mr={'5px'}
								name="Computer"
								size={'sm'}
								src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
								bg="blue.300"
							></Avatar>
							<Flex
								bg="gray.100"
								color="black"
								minW="100px"
								maxW="350px"
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
