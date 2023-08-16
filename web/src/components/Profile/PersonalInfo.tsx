import React from 'react';

import { Box, Text, Button, Grid, GridItem, } from '@chakra-ui/react';
import { Avatar } from '../Avatar'; 




export const PersonalInfo : React.FC = () => {


	return (
		<Box mb={'80px'}>
				<Grid templateColumns={'repeat(12, 1fr)'}>
					<GridItem colSpan={2}>
						<Avatar />
					</GridItem>
					<GridItem colSpan={4} flexDir={'column'} display={'flex'} justifyContent={'center'}>
						<Text fontSize={'17px'} fontWeight={'bold'} opacity={.7}>Profile</Text>
						<Text fontSize={'30px'} fontWeight={'bold'}>@Avocado</Text>
					</GridItem>
					<GridItem colSpan={6} textAlign={'right'} alignItems={'center'} >

						<Button variant={'unstyled'} bg={'black'} color={'white'} size={'sm'} p={'50x 20px'}>
							Send Message
						</Button>
					</GridItem>
				</Grid>	
			</Box>
	)
} 
