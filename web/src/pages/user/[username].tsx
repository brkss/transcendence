import React from 'react';
import { Box, Text, Center, useDisclosure } from '@chakra-ui/react';
import { PersonalInfo, Stats, Layout, Badges, withAuth, Loading } from '../../components'; 
import { useRouter } from 'next/router';
import { profile, getRelationship } from '@/utils/services/'
import { getAccessToken } from '@/utils/token';
import jwtDecode from "jwt-decode";
import { io } from 'socket.io-client';
import { SettingsDrawer } from '../../components/SettingsDrawer';

const GET_USERNAME_TOKEN = () => {
	const _token = getAccessToken();
	const payload : any= jwtDecode(_token);
	if(!payload)
	return "";
	return payload.username;
} 

function Profile(){

	const router = useRouter();
	const { username } = router.query;
	const [data, setData] = React.useState<any>();
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState("");
	const [relationship, setRelationship] = React.useState("none");
	const { onOpen, onClose, isOpen } = useDisclosure();

	React.useEffect(() => {
		
		if(router.isReady){
			const current_username = GET_USERNAME_TOKEN();
			if(current_username === username){
				setRelationship("me");
			}else {
				(async () => {
					const rel = await getRelationship(username as string);
				if(relationship){
						setRelationship(rel.relationship as string);
					}
				})();
			}
			(async () => {
				const results = await profile(username as string);
				if(results.error){
					setError(results.error);
				}else {
					setError("")
				}
				setData(results);
				setLoading(false);
			})();
		}
		}, [username, router.isReady]);

	if(loading)
	return <Loading />

	if(error)
	return (
		<Layout>
			<Center h={'100vh'}>
				<Text fontWeight={'bold'}>{error}</Text>
			</Center>
		</Layout>
	)

	return (
		<Layout>
			<Box display={'none'} pos="absolute" h={"27%"} w={"100%"} top="-40px" left="0" width={"100%"} background={"linear-gradient(180deg, rgba(0,0,0,0.7343531162464986) 0%, rgba(0,0,0,0.5214679621848739) 22%, rgba(255,255,255,0) 100%);"} />
			<Box>
				<PersonalInfo editProfile={onOpen} image={data.avatar} username={data.username} name={data.fullName} relationship={relationship} />
				<Stats username={data.username} />
			</Box>
			<SettingsDrawer onClose={onClose} isOpen={isOpen} />
		</Layout>
	)
}

export default withAuth(Profile);
