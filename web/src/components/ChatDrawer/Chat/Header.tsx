import React from 'react';
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";




export const ChatHeader : React.FC = () => {



	return (
		<Flex p={'20px'} w="100%">
			<Avatar size="md" name="Dan Abrahmov" src="https://bit.ly/dan-abramov">
				<AvatarBadge boxSize="20px" bg="green.500" />
			</Avatar>
			<Flex flexDirection="column" mx="5" justify="center">
				<Text fontSize="lg" fontWeight="bold">
					Ferin Patel
				</Text>
				<Text color="green.500">Online</Text>
			</Flex>
		</Flex>
	)
}
