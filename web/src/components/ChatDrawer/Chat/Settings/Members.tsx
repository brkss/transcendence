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
    members: any[];
    kick: (userID: number) => void;
    ban: (userID: number) => void;
    mute: (userID: number) => void;
    setAdmin: (userID: number) => void;
}

export const Members : React.FC<Props> = ({members, ban, kick, mute, setAdmin}) => {


    return (
        <>
            <Text fontWeight={'bold'}>Members</Text>
            {
                members.map((member, key) => (
                    <Flex border={'2px solid transparent'} borderColor={member.isAdmin ? "gold" : "transparent"} key={key} alignItems={'center'} justifyContent={'space-between'} p={'10px'} m={'10px 0'} bg={'#f0f0f0'} rounded={'14px'}>
                        <Flex alignItems={'center'}>
                            <Avatar d={'40px'} src={member.avatar} />
                            <Text fontWeight={'bold'} ml={'10px'}>@{member.username}</Text>
                        </Flex>
                        {/* check if current user id admin ! */}
                        {true && 
                            
                            <Menu>
                                <MenuButton
                                    aria-label='Options'
                                    as={Button}
                                    size={'sm'}
                                    variant={'unstyled'}
                                >
                                    options
                                </MenuButton>
                                <MenuList fontSize={'14px'} fontWeight={'bold'}>
                                    <MenuItem >
                                        Set Admin
                                    </MenuItem>
                                    <MenuItem onClick={() => ban(member.id)}>
                                        Ban
                                    </MenuItem>
                                    <MenuItem onClick={() => mute(member.id)} >
                                        Mute
                                    </MenuItem>
                                    <MenuItem onClick={() => kick(member.id)} color={'red.500'}>
                                        Kick
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        }
                        
                    </Flex>			
                ))
            }
        </>
    )
}