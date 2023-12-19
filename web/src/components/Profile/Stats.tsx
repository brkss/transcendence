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
import { userStatus, userChatHistory, userAchievements, userMatchHistory } from '@/utils/services'

interface Props {
	username: string;
}

export const Stats: React.FC<Props> = ({username}) => {

	const [loading, setLoading] = React.useState(true);
	const [userGameData, setUserGameData] = React.useState<any>({
		wins: 0,
		loss: 0,
		history: [],
		badges: []
	});
	const fetchUserStatus = () => {
		userStatus(username).then(response => {
			setUserGameData({
				...userGameData,
				wins: response[0],
				loss: response[1],
			})
		}).catch(e => {
			console.log("something went wrong getting status : ", e);
		});
	}

	const fetchUserBadges = () => {
		userAchievements(username).then(response => {
			setUserGameData({
				...userGameData,
				badges: response
			})
		}).catch(e => {
			console.log("something went wrong getting user badges : ", e);
		})
	}

	const fetchUserHistory = () => {
		userMatchHistory(username).then(response => {
			setUserGameData({
				...userGameData,
				history: response
			})
		}).catch(e => {
			console.log("something went wrong getting user history: ", e);	
		})
	}

	

	React.useEffect(() => {
		fetchUserStatus()
		fetchUserBadges()
		fetchUserHistory()
	}, []);

	return (
		<Box mt={'20px'}>
					<Grid templateColumns={'repeat(12, 1fr)'} gap={{md: 10, base: 0}}>
						<GridItem colSpan={{md: 6, base: 12}} pos={"relative"}>
							<Box mb={'20px'} fontWeight={'bold'} fontSize={'30px'} display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
								Stats
							</Box>
							<Box>
								<Text fontWeight={'bold'} fontSize={"14px"} mb="3px" >Wins ({userGameData.wins}%)</Text>
								<Box w={'100%'} h={'20px'} bg={'gray.200'} rounded={'5px'} outline={"1px solid #0000005c"}>
									<Box w={`${userGameData.wins}%`} bg={'green.200'} h={'20px'} rounded={'5px'} />
								</Box>
							</Box>
							<Box mt={'10px'}>
								<Text fontWeight={'bold'} fontSize={"14px"} mb="3px">Loses ({userGameData.wins}%)</Text>
								<Box w={'100%'} h={'20px'} bg={'gray.200'} rounded={'5px'} outline="1px solid #0000005c">
									<Box w={`${userGameData.loss}%`} bg={'red.100'} h={'20px'} rounded={'5px'} />
								</Box>
							</Box>
							<Text  bottom={"10px"} fontSize={"14px"} opacity={.8}>This statistics are based on the games you played.</Text>
						</GridItem>
						<GridItem colSpan={{md: 6, base: 12}} mt={{base: '20px', md: '10px'}}>
							<Badges badges={userGameData.badges} />
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
								{
									userGameData.history.map((record:any, key:any) => (
										<Tr key={key}>
											<Th>{record.mode}</Th>
											<Th>{record.status}</Th>
											<Th>{record.opponent_username}</Th>
											<Th isNumeric>{record.date}</Th>
										</Tr>
									))
								}
							</Tbody>
							
						</Table>
					</TableContainer>
				</Box>
	)
}
