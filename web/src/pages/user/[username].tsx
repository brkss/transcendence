import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';
import { PersonalInfo, Stats, Layout, Badges, withAuth, Loading } from '../../components'; 
import { useRouter } from 'next/router';
import { profile } from '@/utils/services/'

function Profile(){

	const router = useRouter();
	const { username } = router.query;
	const [data, setData] = React.useState<any>();
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState("");

	React.useEffect(() => {
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
	}, [username]);

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
			<Box pos="absolute" h={"27%"} w={"100%"} top="-40px" left="0" width={"100%"} background={"linear-gradient(180deg, rgba(0,0,0,0.7343531162464986) 0%, rgba(0,0,0,0.5214679621848739) 22%, rgba(255,255,255,0) 100%);"} />
			<Box p={'40px'}>
				<PersonalInfo username={data.username} name={data.fullName} />
				<Stats />
			</Box>
		</Layout>
	)
}

export default withAuth(Profile);
