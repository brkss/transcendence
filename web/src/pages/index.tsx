import { withAuth } from "@/components";
import { Center, Text } from '@chakra-ui/react'



function Home(){



	return <Center h={'100vh'}>
		<Text>this page is protected</Text>
	</Center>

}


export default withAuth(Home);
