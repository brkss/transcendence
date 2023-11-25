import React from 'react';
import { DrawerCloseButton, Flex, Avatar, AvatarBadge, Text, Button, Box, Center } from "@chakra-ui/react";
import { FiSettings } from 'react-icons/fi'
import { BsChatDots } from 'react-icons/bs'

interface Props {
	openSettings: () => void;
}


export const ChatHeader : React.FC<Props> = ({openSettings}) => {

	return (
		<Flex justifyContent={'space-between'} p={'20px'} w="100%">
			<DrawerCloseButton />
			<Flex>
				
				<Avatar size="md" src="https://i.pinimg.com/1200x/42/c4/4b/42c44bc8c1351887c834e8cce3d45bf0.jpg">
					<AvatarBadge boxSize="20px" bg="green.500" />
				</Avatar>
				<Flex flexDirection="column" mx="5" justify="center">
					<Text fontSize="lg" fontWeight="bold">
						Ferin Patel
					</Text>
					
				</Flex>
			</Flex>
			<Button variant={"unstyled"} mr={'20px'} onClick={openSettings}>
				<FiSettings size={'20px'} />
			</Button>
		</Flex>
	)
}
