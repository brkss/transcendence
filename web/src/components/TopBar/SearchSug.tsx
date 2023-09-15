import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Avatar } from '../Avatar';
import { search, profile } from '@/utils/services';
import { useRouter } from 'next/router'

interface Props {
	query: string;
}

export const SearchSug : React.FC<Props> = ({query}) => {

	const router = useRouter();
	const [results, setResults] = React.useState([]);

	React.useEffect(() => {
		(async () => {
			const data = await search(query);
			setResults(data)
		})();
	}, [query]);
	
	

	return (
		<Box pos={'absolute'}  mt={'10px'} w={'100%'} bg={'white'} p={'10px'}  rounded={'7px'}>
			{
				results.map((user: any, key) => (
					<Box key={key} display={'flex'} color={'black'} padding={'10px'} alignItems={'center'} _hover={{bg: '#eae5e5', transition: '.3s'}} transition={'.3s'} rounded={'5px'} mb={'10px'} cursor={'pointer'} onClick={() => router.push(`/user/${user.username as any}`)}>
						<Avatar d={'40px'} />
						<Box>
							<Text marginLeft={'15px'} fontWeight={'bold'}>{user.fullName}</Text>
							<Text fontSize={'13px'} opacity={'.8'} marginLeft={'15px'} fontWeight={'bold'}>@{user.username}</Text>
						</Box>
					</Box>
				))
			}
			{ results.length == 0 && 
				<Box display={'flex'} color={'black'} padding={'10px'} alignItems={'center'} rounded={'5px'} opacity={.7} >
					<Text marginLeft={'15px'} fontWeight={'bold'}>0 Results Found</Text>
				</Box>
			}
			
		</Box>
	)
}
