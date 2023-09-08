import { Box, Text } from '@chakra-ui/react';
import { PersonalInfo, Stats, Layout, Badges } from '../../components'; 

export default function Profile(){

	return (
		<Layout>
			<Box pos="absolute" h={"27%"} w={"100%"} top="-40px" left="0" width={"100%"} background={"linear-gradient(180deg, rgba(0,0,0,0.7343531162464986) 0%, rgba(0,0,0,0.5214679621848739) 22%, rgba(255,255,255,0) 100%);"} />
			<Box p={'40px'}>
				<PersonalInfo />
				<Stats />
			</Box>
		</Layout>
	)
}
