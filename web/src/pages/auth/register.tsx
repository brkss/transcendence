import { Input, Text, Box, Center, Button } from '@chakra-ui/react'
import { BsArrowRight } from 'react-icons/bs';
import { LuImagePlus } from 'react-icons/lu'

export default function Register(){



	return (
		<Box h={'100vh'}>
			<Center h={'100%'}>
				<Box w={'20%'}>
					<Box mb={'50px'} textAlign={'center'}>
						<Center h={'100px'} w={'100px'} rounded={'100%'} bg={'black'} m={'auto'}>
							<LuImagePlus color={'white'} size={20} />
						</Center>
					</Box>
					<Text mb={'5px'} fontSize={'15px'} fontWeight={'bold'}>Choose a username</Text>
					<Input outline={'none'} fontWeight={'bold'} p={'20px'} placeholder={'username'} variant={'filled'} />
					<Button display={'flex'} variant={'unstyled'} color={'white'} bg={'black'} p={'5px 20px'} size={'sm'} mt={'20px'}>
						Save
						<BsArrowRight style={{marginLeft: '5px'}} />
					</Button>
				</Box>
			</Center>
		</Box>
	)
}
