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
import { DurationInput } from './DurationInput';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    onMute: (duration: number) => void;
}

export const MuteDurationModal : React.FC<Props> = ({onClose, isOpen, onMute}) => {

    const [duration, setDuration] = React.useState(5);

    return (
        <>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropBlur='40px'
            backdropInvert='80%'
            />
          <ModalContent>
            <ModalHeader>Mute Duration</ModalHeader>
            <ModalCloseButton />
            <ModalBody margin={'auto'}>
              <Text textAlign={'center'} fontSize={'13px'} fontWeight={'bold'} mb={'5px'}>Minutes</Text>
              <DurationInput changedDuration={(v) => setDuration(v)} />
            </ModalBody>
  
            <ModalFooter>
              <Button size={'sm'} colorScheme='blackAlpha' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button size={'sm'} colorScheme={'green'} variant='outline' onClick={() => onMute(duration)} >Mute this user</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )

}