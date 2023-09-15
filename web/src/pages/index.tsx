import React from 'react'
import { withAuth } from "@/components";
import { Box, Center, Text } from '@chakra-ui/react'
import { api } from '@/utils/services/axios.config';


function Home(){

	const [res, setRes] = React.useState("");	
	
	React.useEffect(() => {
		
	}, []);

	const ping = async () => {
		api.get("http://localhost:8000/user/ping").then(res => {
			setRes(res.data);
		}).catch(er => {
			setRes('error !!')
			console.log("req err : ", er);
		}) ;
	}

	return <Center h={'100vh'}>
		<Box>
		<Text display={"block"}>{ ` ${res}` }</Text>
		<button onClick={ping}>ping</button>
		</Box>
	</Center>

}


export default withAuth(Home);
