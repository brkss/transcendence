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
	editProfile: () => void;
}


export const PersonalInfo : React.FC<Props> = ({username, name, image, relationship, editProfile}) => {

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
				<GridItem mr={'10px'} colSpan={{md: 2, base: 3}}>
					<Avatar src={image} />
				</GridItem>
				<GridItem colSpan={{md: 4, base: 4}} flexDir={'column'} display={'flex'} justifyContent={'center'}>
					<Text fontSize={{md: '17px', base: '15px'}} fontWeight={'bold'} opacity={.7}>{name}</Text>
					<Text fontSize={{md: '30px', base: '12px'}} fontWeight={'bold'}>@{username}</Text>
				</GridItem>
				<GridItem colSpan={{md: 6, base: 5}} textAlign={'right'} display={'flex'} justifyContent={'end'} alignItems={'center'} >
					<FriendshipActions addFriend={handleAddFriend} relationship={relationship} acceptFriend={handleAcceptFriend} edit={editProfile} />	
				</GridItem>
			</Grid>	
		</Box>
	)
} 
