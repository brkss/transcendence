import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text, Button, Image,
    Center,
    Box,
    PinInput, PinInputField, HStack, useToast
} from '@chakra-ui/react'
import { Activate2FA, GenerateQRCode } from '@/utils/services';

interface Props {
    isOpen: boolean,
    onClose: () => void;
    activated: () => void;
}

export const TwoFASettings : React.FC<Props> = ({isOpen, onClose, activated}) => {

    const [loading, setLoading] = React.useState(true);
    const [qrCode, setQrCode] = React.useState("");
    const [enterCode, setEnterCode] = React.useState(false);
    const [code, setCode] = React.useState<string>("");
    const toast = useToast();

    React.useEffect(() => {
        if(loading){
            GenerateQRCode().then(response => {
                if(response){
                    setEnterCode(false)
                    setQrCode(response.code);
                    setLoading(false);
                }
                //console.log("response : ", response);
            }).catch(e => {
                //console.log("error : ", e);
            })
        }
    }, [isOpen]);


    const handleActivate = () => {
        if(!enterCode){
            setEnterCode(true);
            return;
        }else if(code){
            
            Activate2FA(code).then(response => {
                //console.log("response : ", response);
                toast({
                    title: "Two factor authentication is enabled successfuly",
                    status: 'success',
                    duration: 9000,
                    isClosable: true
                })
                activated();
            }).catch(e => {
                //console.log("error while activating 2fa : ", e);
                toast({
                    title: "Something went wrong activating 2 factor authentication",
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                })
            });
        }
    }

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Acitvate 2 Factor Authentication</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
            {
                !enterCode && qrCode && <Image src={qrCode} />
            }
            {
                enterCode && (
                    <Box>
                        <HStack>
                            <PinInput onChange={(v) => setCode(v)}>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>
                    </Box>
                )
            }
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button size={'sm'} variant={'ghost'} colorScheme='orange' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleActivate} size={'sm'} colorScheme='green' variant='outline'>{!enterCode ? 'Setup the code' : 'Activate'}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}