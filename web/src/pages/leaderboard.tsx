import React from 'react';
import {
	Table,
	Tbody,
	Tr,
	Td,
	TableContainer,
	Box,
	Text
} from '@chakra-ui/react'
import { Layout, Avatar, withAuth, Loading } from '../components'
import { userLeaderBoard } from '@/utils/services';

function Leaderboard() {

	const [leaderboard, setLeaderBoard] = React.useState<any []>()
	const [loading, setLoading] = React.useState(true);
	const fetchLeaderBoard = () => {
		userLeaderBoard().then(response => {
			setLeaderBoard(response);
			setLoading(false);
		}).catch(e => {
			//console.log("something went wrong getting leaderboard : ", e);
		})
	}

	React.useEffect(() => {
		fetchLeaderBoard();
	}, []);

	if(loading)
		return (<Loading />)

	return (
		<Layout>
			<Box>
				<Text mb={'20px'} fontSize={'25px'} fontWeight={'bold'}>Leaderboard</Text>
				<TableContainer>
					<Table variant='striped' size={'sm'}>
						<Tbody>
							{
								leaderboard?.map((user, key) => (
									<Tr key={key}>
										<Td>
											<Avatar src={user.avatar} d={'40px'} />
										</Td>
										<Td fontWeight={'bold'}>{key + 1}</Td>
										<Td fontWeight={'bold'}>@{user.username}</Td>
										<Td fontWeight={'bold'} isNumeric>{user.wins} Wins</Td>
									</Tr>
								))
							}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</Layout>
	)
}
export default withAuth(Leaderboard);