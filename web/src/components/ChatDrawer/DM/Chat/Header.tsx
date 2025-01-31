import React from 'react';
import { DrawerCloseButton, Flex, Avatar, AvatarBadge, Text, Button, Box, Center } from "@chakra-ui/react";
import { FiSettings } from 'react-icons/fi'
import { BsChatDots } from 'react-icons/bs'
import { useRouter } from 'next/router';

interface Props {
	name: string;
	username: string;
	image: string;
	invite: () => void;
}


export const ChatHeader : React.FC<Props> = ({name, image, username, invite}) => {

	const router = useRouter()

	
	return (
		<Flex justifyContent={'space-between'} p={'20px'} w="100%">
			<DrawerCloseButton />
			<Flex cursor={'pointer'} >
				<Avatar size="md" src={image}>
					<AvatarBadge boxSize="20px" bg="green.500" />
				</Avatar>
				<Flex flexDirection="column" mx="5" justify="center">
					<Text onClick={() => router.push(`/user/${username}`)} fontSize="lg" fontWeight="bold">
						{name}
					</Text>
					<Text onClick={invite} p={'0 10px'} bg={'#efefef'} fontSize={'14px'} rounded={'5px'} fontWeight={'bold'} textAlign={'center'} _hover={{bg: '#'}}>invite to game</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}
