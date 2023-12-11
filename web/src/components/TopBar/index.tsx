import React from 'react';
import { Box, Grid, GridItem, Text, Input, Button } from '@chakra-ui/react';
import { Avatar } from '../Avatar';
import { useRouter } from 'next/router';
import { SearchSug } from './SearchSug';
import { getPayload } from '@/utils/helpers';
import jwtDecode from 'jwt-decode';
import { getAccessToken } from '@/utils/token';
import { profile } from '@/utils/services';
import { Loading } from '../General';


export const TopBar : React.FC = () => {

	const [loading, setLoading] = React.useState(true);
	const [query, setQuery] = React.useState<string>("");
	const [user, setUser] = React.useState<any>(null);
	const router = useRouter();

	const payload : any= getPayload();

	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setQuery(e.currentTarget.value)
	}

	React.useEffect(() => {
		// fetch user's info 
		const _payload = jwtDecode(getAccessToken()) as any;
		if(_payload && _payload.username){
			profile(_payload.username).then(response => {
				setLoading(false);
				setUser(response);
				// save user's info
				localStorage.removeItem("ME");
				localStorage.setItem("ME", JSON.stringify(response));
				console.log("user's profile response : ", response);
			}).catch(e => {
				console.log("get user profile erro : ", e);
			})
		}
	}, []);

	if(loading)
		return <Loading />

	return (
			<Box>
				<Box bg={'black'}  rounded={''} p={'10px 20px'} color={'white'} mb={'40px'} pos={"fixed"} w={"100%"} zIndex="99" >
					<Grid templateColumns={'repeat(12, 1fr)'}>
						<GridItem colSpan={4} display={{md: 'flex', base: 'none'}} flexDir={'column'} justifyContent={'center'} >
							<Text fontSize={'15px'} fontWeight={'bold'}>🦀</Text>
						</GridItem>
						<GridItem colSpan={{md: 4, base: 9}} pos={'relative'}>
							<Input onChange={(e) => handleSearchInput(e)} size={'sm'} w={'100%'} p={'7px 20px'} rounded={'5px'} variant={'unstyled'} bg={'#262626'} color={'white'} placeholder={'search...'} fontWeight={'bold'}  />
							{ query.length >= 3 && <SearchSug query={query} clearEntry={() => setQuery("")} /> }
						</GridItem>
						<GridItem colSpan={{md: 4, base: 3}}>
							<Button float={'right'} variant={'unstyled'} onClick={() => router.push(`/user/${payload?.username || ""}`)}>
								<Avatar src={user.avatar} d={'40px'} />
							</Button>						
						</GridItem>
					</Grid>
				</Box>
				<Box h={"75px"} />
			</Box>
	)
}
