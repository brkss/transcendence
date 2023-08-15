import React from 'react';
import { Box, Grid, GridItem, Text, Input, Button } from '@chakra-ui/react';



export const TopBar : React.FC = () => {



	return (
			<Box bg={'black'}  rounded={''} p={'10px 20px'} color={'white'} mb={'40px'}>
				<Grid templateColumns={'repeat(12, 1fr)'}>
					<GridItem colSpan={4} display={'flex'} flexDir={'column'} justifyContent={'center'} >
						<Text fontSize={'15px'} fontWeight={'bold'}>TRANSADANCE!</Text>
					</GridItem>
					<GridItem colSpan={4}>
						<Input size={'sm'} w={'100%'} p={'7px 20px'} rounded={'5px'} variant={'unstyled'} bg={'#262626'} color={'white'} placeholder={'search...'} fontWeight={'bold'} />
					</GridItem>
					<GridItem colSpan={4}>
						
					</GridItem>
				</Grid>
			</Box>
	)
}
