import React from 'react';
import { DrawerCloseButton, Flex, Avatar, AvatarBadge, Text, Button, Box } from "@chakra-ui/react";
import { FiSettings } from 'react-icons/fi'

interface Props {
	openSettings: () => void;
}


export const ChatHeader : React.FC<Props> = ({openSettings}) => {

	return (
		<Flex justifyContent={'space-between'} p={'20px'} w="100%">
			<DrawerCloseButton />
			<Flex>
				<Avatar size="md" name="Dan Abrahmov" src="https://cdn.intra.42.fr/users/30c84ae923dee697c9eec28ebedd7112/small_adriouic.jpg">
					<AvatarBadge boxSize="20px" bg="green.500" />
				</Avatar>
				<Flex flexDirection="column" mx="5" justify="center">
					<Text fontSize="lg" fontWeight="bold">
						Ferin Patel
					</Text>
					<Text color="green.500">Online</Text>
				</Flex>
			</Flex>
			<Button variant={"unstyled"} mr={'20px'} onClick={openSettings}>
				<FiSettings size={'20px'} />
			</Button>
		</Flex>
	)
}
