import React from 'react';
import { Box, Text, Button, Grid, GridItem, Container, Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer, 
} from '@chakra-ui/react';
import { Badges } from './Badges';  


export const Stats: React.FC = () => {


	return (
		<Box mt={'20px'}>
					<Grid templateColumns={'repeat(12, 1fr)'} gap={10}>
						<GridItem colSpan={6} pos={"relative"}>
							<Box mb={'20px'} fontWeight={'bold'} fontSize={'30px'} display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
								Stats
								<Text float={"right"} fontSize={'sm'} display={'inline-block'} p={'5px 20px'} bg={'black'} fontWeight={'bold'} color={'white'} rounded={"15px"} >Ranked #12</Text>
							</Box>
							<Box>
								<Text fontWeight={'bold'} fontSize={"14px"} mb="3px" >Wins (40%)</Text>
								<Box w={'100%'} h={'20px'} bg={'gray.200'} rounded={'5px'} outline={"1px solid #0000005c"}>
									<Box w={'40%'} bg={'green.200'} h={'20px'} rounded={'5px'} />
								</Box>
							</Box>
							<Box mt={'10px'}>
								<Text fontWeight={'bold'} fontSize={"14px"} mb="3px">Loses (60%)</Text>
								<Box w={'100%'} h={'20px'} bg={'gray.200'} rounded={'5px'} outline="1px solid #0000005c">
									<Box w={'60%'} bg={'red.100'} h={'20px'} rounded={'5px'} />
								</Box>
							</Box>
							<Text pos={"absolute"} bottom={"10px"} fontSize={"14px"} opacity={.8}>This statistics are based on the games you played.</Text>
						</GridItem>
						<GridItem colSpan={6}>
							<Badges />
						</GridItem>
					</Grid>
					<Text mt="40px" mb={'20px'} fontWeight={'bold'} fontSize={'30px'}>History</Text>
					<TableContainer mt={'20px'}>
						<Table variant='striped' size={'sm'}>
							<Thead>
								<Tr>
									<Th>Type</Th>
									<Th>Status</Th>
									<Th>Player</Th>
									<Th isNumeric>Date</Th>
								</Tr>
							</Thead>
							<Tbody>
								<Tr rounded={'10px'} fontWeight={'bold'}>
									<Td>1v1</Td>
									<Td>Win</Td>
									<Td>@marcos</Td>
									<Td isNumeric>24/8/2023</Td>
								</Tr>
								<Tr rounded={'10px'} fontWeight={'bold'} >
									<Td>1v1</Td>
									<Td>Win</Td>
									<Td>@marcos</Td>
									<Td isNumeric>24/8/2023</Td>
								</Tr>
								<Tr rounded={'10px'} fontWeight={'bold'} >
									<Td>1v1</Td>
									<Td>Win</Td>
									<Td>@marcos</Td>
									<Td isNumeric>24/8/2023</Td>
								</Tr>
								<Tr rounded={'10px'} fontWeight={'bold'} >
									<Td>1v1</Td>
									<Td>Win</Td>
									<Td>@marcos</Td>
									<Td isNumeric>24/8/2023</Td>
								</Tr>
							</Tbody>
							
						</Table>
					</TableContainer>
				</Box>
	)
}
