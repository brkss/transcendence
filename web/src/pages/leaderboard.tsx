

import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
	Box,
	Container,
	Text
} from '@chakra-ui/react'

import { Avatar } from '../components'

export default function(){



	return (
		<Box>
			<Container maxW={'container.md'}>
				<Text mb={'20px'} fontSize={'25px'} fontWeight={'bold'}>Leaderboard</Text>
				<TableContainer>
					<Table variant='simple'>
						<Tbody>
							<Tr>
								<Td>
									<Avatar d={'40px'} />
								</Td>
								<Td fontWeight={'bold'}>#1</Td>
								<Td fontWeight={'bold'}>@keye</Td>
								<Td fontWeight={'bold'} isNumeric>122 Match</Td>
							</Tr>
							<Tr>
								<Td>
									<Avatar d={'40px'} />
								</Td>
								<Td fontWeight={'bold'}>#2</Td>
								<Td fontWeight={'bold'}>@keye</Td>
								<Td fontWeight={'bold'} isNumeric>122 Match</Td>
							</Tr>
							
						</Tbody>
					</Table>
				</TableContainer>
			</Container>
		</Box>
	)
}
