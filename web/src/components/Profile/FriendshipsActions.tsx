import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { AiOutlineEdit, AiOutlineUserAdd, AiOutlineUserSwitch} from 'react-icons/ai';
import { BiUserCheck } from 'react-icons/bi'

interface Props {
	relationship: string;
	addFriend: () => void;
	acceptFriend: () => void;
}

export const FriendshipActions : React.FC<Props> = ({relationship, addFriend, acceptFriend}) => {


	return (
		<Box>
			{
				{
					'pending': (
						<Box>
							<Button variant={'unstyled'} bg={'blue.50'} color={'black'} size={'sm'} p={'50x 20px'} onClick={() => acceptFriend()}>
								<AiOutlineUserSwitch style={{display: "inline-block", marginRight: '5px', marginBottom: "3px" }} size={17} /> Accept
							</Button>
						</Box>
					),
					'none': <Button variant={'unstyled'} bg={'black'} color={'white'} size={'sm'} p={'50x 20px'} onClick={addFriend}>
								<AiOutlineUserAdd style={{display: "inline-block", marginRight: '5px', marginBottom: "3px" }} size={17} /> Add Friend
							</Button>,
					'accepted': (
						<Box>	
							<Button variant={'unstyled'} bg={'black'} color={'white'} size={'sm'} p={'50x 20px'} cursor={'unset'} >
								<BiUserCheck style={{display: "inline-block", marginRight: '5px', marginBottom: "3px" }} size={17} /> Friends
							</Button>
						</Box>
					),
					'sent': (
						<Box>
							<Button variant={'unstyled'} bg={'black'} color={'white'} size={'sm'} p={'50x 20px'} cursor={'unset'}>
								<AiOutlineUserAdd style={{display: "inline-block", marginRight: '5px', marginBottom: "3px" }} size={17} /> Pending
							</Button>
						</Box>
					),
					'me': (
						<Box>
							<Button variant={'unstyled'} bg={'black'} color={'white'} size={'sm'} p={'50x 20px'} onClick={() => {}}>
								<AiOutlineEdit style={{display: "inline-block", marginRight: '5px', marginBottom: "3px" }} size={17} /> Edit profile
							</Button>
						</Box>
					)
				}[relationship]
			}
		</Box>
	)
}
