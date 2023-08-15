import { Box, Container, Text } from '@chakra-ui/react';
import { PersonalInfo, Stats } from '../../components'; 

export default function Profile(){

	return (
		<Box p={'40px'}>
			<Container maxW='container.md' >
				<PersonalInfo />
				<Box mt={'30px'}>
					<Text mb={'20px'} fontWeight={'bold'} fontSize={'30px'}>Badges</Text>
					<Box overflow={'auto'} whiteSpace={'nowrap'}>
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
						<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'gray.100'} mr={'10px'} rounded={'18px'} />
					</Box>
				</Box>
				<Stats />
				
			</Container>
		</Box>
	)
}
