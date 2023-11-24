import React from 'react';
import {
    Flex,
    Text, 
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Button,
    useDisclosure
} from '@chakra-ui/react';
import { Avatar } from '../../../Avatar'
import { MuteDurationModal } from './MuteDuration';

interface Props {
    members: any[];
    kick: (userID: number) => void;
    ban: (userID: number) => void;
    mute: (userID: number, duration: number) => void;
    setAdmin: (userID: number) => void;
}

export const Members : React.FC<Props> = ({members, ban, kick, mute, setAdmin}) => {

    const _durationModal = useDisclosure();
    const [selectedUser, setSelectedUser] = React.useState(-1);
    const [duration, setDuration] = React.useState(5);

    const handleMute = (uid: number) => {
        setSelectedUser(uid);
        _durationModal.onOpen();
    }

    const handleMuting = (duration: number) => {
        mute(selectedUser, duration);
        _durationModal.onClose();
    }

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
                                    <MenuItem onClick={() => setAdmin(member.id)} >
                                        Set Admin
                                    </MenuItem>
                                    <MenuItem onClick={() => ban(member.id)}>
                                        Ban
                                    </MenuItem>
                                    <MenuItem onClick={() => handleMute(member.id)} >
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
            { selectedUser > -1 && <MuteDurationModal onClose={_durationModal.onClose} isOpen={_durationModal.isOpen} onMute={(duration: number) => handleMuting(duration) } /> }
        </>
    )
}