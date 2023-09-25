import React from 'react';
import { Box, Text, Button, Grid, GridItem, useToast } from '@chakra-ui/react';
import { Avatar } from '../Avatar'; 
import { AiOutlineUserAdd } from 'react-icons/ai'
import { acceptFriend, addFriend } from '@/utils/services/user.axios';
import { FriendshipActions } from './FriendshipsActions';

interface Props {
	username: string;
	name: string;
	image: string;
	relationship: string;
}


export const PersonalInfo : React.FC<Props> = ({username, name, image, relationship}) => {

	const toast = useToast();

	const handleAddFriend = async () => {
		const response = await addFriend(username);
		if(response.error){
			toast({
				title : response.error,
				status: 'warning',
				duration: 9000,
				isClosable: true,
			})
		}else if(response.success){
			toast({
				title: response.success,
				status: 'success',
				duration: 9000,
				isClosable: true,
			})
		}
		//console.log("add friend : ", response);
	}

	const handleAcceptFriend = async () => {
		const response = await acceptFriend(username);
		if(response.error){
			toast({
				title : response.error,
				status: 'warning',
				duration: 9000,
				isClosable: true,
			})
		}else if(response.success){
			toast({
				title: response.success,
				status: 'success',
				duration: 9000,
				isClosable: true,
			})
		}
		//console.log("add friend : ", response);
	}

	return (
		<Box mb={'80px'}>
			<Grid templateColumns={'repeat(12, 1fr)'}>
				<GridItem mr={'10px'} colSpan={3}>
				<Avatar src={image} />
				</GridItem>
				<GridItem colSpan={5} flexDir={'column'} display={'flex'} justifyContent={'center'}>
					<Text fontSize={{md: '17px', base: '15px'}} fontWeight={'bold'} opacity={.7}>{name}</Text>
					<Text fontSize={{md: '30px', base: '12px'}} fontWeight={'bold'}>@{username}</Text>
				</GridItem>
				<GridItem colSpan={4} textAlign={'right'} alignItems={'center'} >
					<FriendshipActions addFriend={handleAddFriend} relationship={relationship} acceptFriend={handleAcceptFriend} />	
				</GridItem>
			</Grid>	
		</Box>
	)
} 
