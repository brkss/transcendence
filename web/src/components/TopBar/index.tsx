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

const _topBarStyle = {
	top: {
		background: "transparent",
	},
	down: {
		background: "rgb(213 211 211 / 56%)",
    	backdropFilter: "blur(15px)"
	}
}


export const TopBar : React.FC = () => {

	const [loading, setLoading] = React.useState(true);
	const [query, setQuery] = React.useState<string>("");
	const [user, setUser] = React.useState<any>(null);
	const router = useRouter();
	const [onTop, setOnTop] = React.useState(true); 

	const payload : any= getPayload();

	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setQuery(e.currentTarget.value)
	}

	React.useEffect(() => {
		const onScroll = () => {
			if(window.pageYOffset < 5)
				setOnTop(true);
			else
				setOnTop(false);
			console.log("offset : ", window.pageYOffset);
		}
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        

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

		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	if(loading)
		return <Loading />

	return (
			<Box >
							<Box pos="absolute" h={"27%"} w={"100%"} top="-40px" left="0" width={"100%"} background={"linear-gradient(180deg, rgba(0,0,0,0.7343531162464986) 0%, rgba(0,0,0,0.5214679621848739) 22%, rgba(255,255,255,0) 100%);"} />
				<Box bg={'black'}  rounded={''} p={'7px 20px 7px'} color={'black'} mb={'40px'} pos={"fixed"} w={"100%"} zIndex="999" style={onTop ? _topBarStyle.top as any : _topBarStyle.down as any} >
					<Grid templateColumns={'repeat(12, 1fr)'}>
						<GridItem colSpan={4} display={{md: 'flex', base: 'none'}} flexDir={'column'} justifyContent={'center'} >
							<Text fontSize={'15px'} fontWeight={'bold'}>43150</Text>
						</GridItem>
						<GridItem colSpan={{md: 4, base: 9}} pos={'relative'}>
							<Input onChange={(e) => handleSearchInput(e)} size={'sm'} w={'100%'} mt={'3px'} p={'7px 20px'} rounded={'5px'} variant={'unstyled'} bg={'#5d5a5a'} color={'white'} placeholder={'search...'} fontWeight={'bold'}  />
							{ query.length >= 3 && <SearchSug query={query} clearEntry={() => setQuery("")} /> }
						</GridItem>
						<GridItem colSpan={{md: 4, base: 3}}>
							<Button  float={'right'} variant={'unstyled'} onClick={() => router.push(`/user/${payload?.username || ""}`)}>
								<Avatar rounded src={user.avatar} d={'40px'} />
							</Button>						
						</GridItem>
					</Grid>
				</Box>
				<Box h={"75px"} />
			</Box>
	)
}
