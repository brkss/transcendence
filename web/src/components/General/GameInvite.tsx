import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button
} from '@chakra-ui/react'
import { useRouter } from 'next/router';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    gid: number;
}

export const GameInvitation : React.FC<Props> = ({onClose, isOpen, gid}) => {

    const router = useRouter();


    return (
        <>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>You got invited to a game</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text></Text> 
                </ModalBody>
                <ModalFooter>
                    <Button size={'sm'} colorScheme='orange' variant={'ghost'} mr={3} onClick={onClose}>
                        Deny
                    </Button>
                    <Button size={'sm'} variant='outline' onClick={() => router.push(`/game?gid=${gid}`)}>Accept</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            </>
    )
}