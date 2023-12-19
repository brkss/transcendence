import React from 'react';
import { Box, Text, Center, Image } from '@chakra-ui/react'; 

interface Props {
	badges: any[];
}


export const Badges : React.FC<Props> = ({badges}) => {



	return (
		<Box>
			<Text mb={'20px'} fontWeight={'bold'} fontSize={'30px'}>Badges</Text>
			<Box overflow={'auto'} whiteSpace={'nowrap'}>
				{
					badges.map((badge, key) => (
						<Center key={key} h={'150px'} w={'200px'} >
							<Box>
								<Image  w={'130px'} rounded={'18px'} src={badge.path} borderRadius={'18px'} />
								<Text fontWeight={'bold'} fontSize={'15px'} >{badge.min_win} wins</Text>
							</Box>
						</Center>
					))
				}
				{badges.length === 0 && <Center w={'100%'}>user have no achivements</Center>}
				
				{/*<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />
				<Box display={'inline-block'} h={'150px'} w={'200px'}  bg={'#e7f8ff'} mr={'10px'} rounded={'18px'} border="1px solid #00000036" />*/}
			</Box>
		</Box>
	)
}
