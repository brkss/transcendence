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



export const Stats: React.FC = () => {


	return (
		<Box mt={'20px'}>
					<Text mb={'20px'} fontWeight={'bold'} fontSize={'30px'}>Stats</Text>
					<Grid templateColumns={'repeat(12, 1fr)'} gap={10} mb={'30px'}>
						<GridItem colSpan={6}>
							<Box>
								<Text fontWeight={'bold'}>Wins (40%)</Text>
								<Box w={'100%'} h={'20px'} bg={'gray.200'} rounded={'5px'}>
									<Box w={'40%'} bg={'green.200'} h={'20px'} rounded={'5px'} />
								</Box>
							</Box>
							<Box mt={'10px'}>
								<Text fontWeight={'bold'}>Loses (60%)</Text>
								<Box w={'100%'} h={'20px'} bg={'gray.200'} rounded={'5px'}>
									<Box w={'60%'} bg={'red.100'} h={'20px'} rounded={'5px'} />
								</Box>
							</Box>
						</GridItem>
						<GridItem colSpan={6} textAlign={'right'} display={'flex'} flexDir={'column'} justifyContent={'flex-end'}>
							<Box>	
								<Text display={'inline-block'} p={'5px 20px'} bg={'black'} fontWeight={'bold'} color={'white'} >Ranked #12</Text>
							</Box>
						</GridItem>
					</Grid>
					<Text mb={'20px'} fontWeight={'bold'} fontSize={'30px'}>History</Text>
					<TableContainer mt={'20px'}>
						<Table variant='striped' size={'md'}>
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
