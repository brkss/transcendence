import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';
import { BsChatLeftDots } from 'react-icons/bs'
import { IoGameControllerOutline } from 'react-icons/io5'
import { FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { MdOutlineLeaderboard } from 'react-icons/md'



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
		name: "board",
		Icon: MdOutlineLeaderboard
	},
	{
		name: "friends",
		Icon: FiUsers
	},
	{
		name: "Settings",
		Icon: FiSettings
	},
	{
		name: "Logout",
		Icon: FiLogOut
	}
]

interface Props {
	signal: (sig: string) => void;
}

export const SideBar : React.FC<Props> = ({signal}) => {

	return (
		<Box display={'flex'} flexDir={'column'} alignItems={'center'}>
			{
				_items.map(({name, Icon}, key) => (
					<Box onClick={() => signal(name.toLowerCase())} textAlign={'center'} key={key} mb={'20px'} transition={'.3s'} cursor={'pointer'} _hover={{transform: 'scale(.95)', transition: '.3s'}}>
						<Center h={'45px'} w={'45px'} rounded={'16px'} bg={'black'} m={'auto'}>
							<Icon color={'white'} size={'15px'} />	
						</Center>
						<Text fontWeight={'bold'} fontSize={'13px'}>{name}</Text>
					</Box>
				))
			}
		</Box>
	)
}
