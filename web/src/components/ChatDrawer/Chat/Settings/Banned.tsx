import React from 'react';
import {
    Flex,
    Text, 
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Button
} from '@chakra-ui/react';
import { Avatar } from '../../../Avatar'

interface Props {
    banned: any[];
    unban: (userID: number) => void;
}

export const BannedMembers : React.FC<Props> = ({banned, unban}) => {

    return (
        <>
            <Text fontWeight={'bold'}>Banned Members</Text>
            {
                banned.map((member, key) => (
                    <Flex border={'2px solid transparent'} borderColor={member.isAdmin ? "gold" : "transparent"} key={key} alignItems={'center'} justifyContent={'space-between'} p={'10px'} m={'10px 0'} bg={'#f0f0f0'} rounded={'14px'}>
                        <Flex alignItems={'center'}>
                            <Avatar d={'40px'} src={member.avatar} />
                            <Text fontWeight={'bold'} ml={'10px'}>@{member.username}</Text>
                        </Flex>
                        {/* check if current user id admin ! */}
                        {true && 
                            
                            <Button size={'sm'} onClick={() => unban(member.id)}>unban</Button>
                        }
                    </Flex>			
                ))
            }
        </>
    )
}