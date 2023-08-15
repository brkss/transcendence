import { Box, Text } from '@chakra-ui/react';
import { PersonalInfo, Stats, Layout, Badges } from '../../components'; 

export default function Profile(){

	return (
		<Layout>
			<Box p={'40px'}>
				<PersonalInfo />
				<Badges />					
				<Stats />
			</Box>
		</Layout>
	)
}
