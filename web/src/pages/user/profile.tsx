import { Box, Container } from '@chakra-ui/react';
import { PersonalInfo, Stats } from '../../components'; 

export default function Profile(){




	return (
		<Box p={'40px'}>
			<Container maxW='container.md' >
				<PersonalInfo />
				<Stats />
			</Container>
		</Box>
	)
}
