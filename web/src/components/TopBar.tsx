import React from 'react';
import { Box, Grid, GridItem, Text, Input, Button } from '@chakra-ui/react';



export const TopBar : React.FC = () => {



	return (
		<Box p={'20px'}>
			<Box bg={'gray.100'}  rounded={'50px'} p={'5px 20px'} color={''}>
				<Grid templateColumns={'repeat(12, 1fr)'}>
					<GridItem colSpan={4} display={'flex'} flexDir={'column'} justifyContent={'center'} >
						<Text fontSize={'15px'} fontWeight={'bold'}>TRANSADANCE!</Text>
					</GridItem>
					<GridItem colSpan={4}>
						<Input size={'sm'} w={'100%'} p={'7px 20px'} rounded={'50px'} variant={'unstyled'} bg={'white'} color={'black'} placeholder={'search...'} />
					</GridItem>
					<GridItem colSpan={4}>
						
					</GridItem>
				</Grid>
			</Box>
		</Box>
	)
}
