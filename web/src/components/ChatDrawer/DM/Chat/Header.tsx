import React from 'react';
import { DrawerCloseButton, Flex, Avatar, AvatarBadge, Text, Button, Box, Center } from "@chakra-ui/react";
import { FiSettings } from 'react-icons/fi'
import { BsChatDots } from 'react-icons/bs'

interface Props {
	name: string;
	image: string;
}


export const ChatHeader : React.FC<Props> = ({name, image}) => {

	return (
		<Flex justifyContent={'space-between'} p={'20px'} w="100%">
			<DrawerCloseButton />
			<Flex>
				
				<Avatar size="md" src={image}>
					<AvatarBadge boxSize="20px" bg="green.500" />
				</Avatar>
				<Flex flexDirection="column" mx="5" justify="center">
					<Text fontSize="lg" fontWeight="bold">
						{name}
					</Text>
					
				</Flex>
			</Flex>
		</Flex>
	)
}
