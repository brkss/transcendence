import React from 'react';
import { Box, Grid, GridItem, Text, Input, Button } from '@chakra-ui/react';
import { Avatar } from '../Avatar';
import { useRouter } from 'next/router';
import { SearchSug } from './SearchSug';

export const TopBar : React.FC = () => {

	const [query, setQuery] = React.useState<string>("");
	const router = useRouter();

	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setQuery(e.currentTarget.value)
	}

	return (
			<Box>
				<Box bg={'black'}  rounded={''} p={'10px 20px'} color={'white'} mb={'40px'} pos={"fixed"} w={"100%"} zIndex="99" >
					<Grid templateColumns={'repeat(12, 1fr)'}>
						<GridItem colSpan={4} display={'flex'} flexDir={'column'} justifyContent={'center'} >
							<Text fontSize={'15px'} fontWeight={'bold'}>TRANSADANCE!</Text>
						</GridItem>
						<GridItem colSpan={4} pos={'relative'}>
							<Input onChange={(e) => handleSearchInput(e)} size={'sm'} w={'100%'} p={'7px 20px'} rounded={'5px'} variant={'unstyled'} bg={'#262626'} color={'white'} placeholder={'search...'} fontWeight={'bold'}  />
							{ query.length >= 3 && <SearchSug query={query} /> }
						</GridItem>
						<GridItem colSpan={4}>
							<Button float={'right'} variant={'unstyled'} onClick={() => router.push("/user/profile")}>
								<Avatar d={'40px'} />
							</Button>						
						</GridItem>
					</Grid>
				</Box>
				<Box h={"75px"} />
			</Box>
	)
}
