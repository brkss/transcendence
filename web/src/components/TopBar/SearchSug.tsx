import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Avatar } from '../Avatar';



export const SearchSug : React.FC = () => {


	return (
		<Box pos={'absolute'}  mt={'10px'} w={'100%'} bg={'white'} p={'10px'}  rounded={'7px'}>
			<Box display={'flex'} color={'black'} padding={'10px'} alignItems={'center'} _hover={{bg: '#eae5e5', transition: '.3s'}} transition={'.3s'} rounded={'5px'} mb={'10px'} cursor={'pointer'}>
				<Avatar d={'40px'} />
				<Text marginLeft={'15px'} fontWeight={'bold'}>Brahim Berkasse</Text>
			</Box>
			<Box display={'flex'} color={'black'} padding={'10px'} alignItems={'center'} _hover={{bg: '#eae5e5', transition: '.3s'}} transition={'.3s'} rounded={'5px'} mb={'10px'} cursor={'pointer'}>
				<Avatar d={'40px'} />
				<Text marginLeft={'15px'} fontWeight={'bold'}>Brahim Berkasse</Text>
			</Box>
			<Box display={'flex'} color={'black'} padding={'10px'} alignItems={'center'} _hover={{bg: '#eae5e5', transition: '.3s'}} transition={'.3s'} rounded={'5px'} mb={'10px'} cursor={'pointer'}>
				<Avatar d={'40px'} />
				<Text marginLeft={'15px'} fontWeight={'bold'}>Brahim Berkasse</Text>
			</Box>
		</Box>
	)
}
