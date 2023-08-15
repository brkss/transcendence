import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';
import { BsChatLeftDots } from 'react-icons/bs'
import { IoGameControllerOutline } from 'react-icons/io5'
import { FiUsers, FiSettings } from 'react-icons/fi';

const _items = [
	{
		name: "chat",
		Icon: BsChatLeftDots
	},
	{
		name: "game",
		Icon: IoGameControllerOutline
	},
	{
		name: "friends",
		Icon: FiUsers
	},
	{
		name: "Settings",
		Icon: FiSettings
	}
]

export const SideBar : React.FC = () => {

	return (
		<Box display={'flex'} flexDir={'column'} alignItems={'center'}>
			{
				_items.map(({name, Icon}, key) => (
					<Box textAlign={'center'} key={key} mb={'20px'}>
						<Center h={'45px'} w={'45px'} rounded={'16px'} bg={'black'}>
							<Icon color={'white'} size={'15px'} />	
						</Center>
						<Text fontWeight={'bold'} fontSize={'13px'}>{name}</Text>
					</Box>
				))
			}
			
		</Box>
	)
}
