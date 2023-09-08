import {
	Table,
	Tbody,
	Tr,
	Td,
	TableContainer,
	Box,
	Text
} from '@chakra-ui/react'
import { Layout, Avatar } from '../components'

export default function(){



	return (
		<Layout>
		<Box>
				<Text mb={'20px'} fontSize={'25px'} fontWeight={'bold'}>Leaderboard</Text>
				<TableContainer>
					<Table variant='striped' size={'sm'}>
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
		</Box>
		</Layout>
	)
}
