import React from 'react';
import { HStack, Center, Box, Text, PinInput, PinInputField, Spinner } from '@chakra-ui/react';
import { Verify2FA } from '@/utils/services';


export default function Otp(){

    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [code, setCode] = React.useState("");


    const handleCodeChange = (v: string) => {
        if(v.length >= 6){
            setLoading(true);
            Verify2FA(v).then(response => {
                //console.log("response verifying code : ", response);
            }).catch(e => {
                setLoading(false);
                setError("Invalid Code");
                //console.log("error verifying code : ", e);
            })
        }
    }

    return (
        <Center h={'100vh'}>
            {
                loading ? 
                    <Box textAlign={'center'}>
                        <Spinner mb={'20px'} />
                        <Text opacity={.8} fontSize={'14px'}>we will redirect you in a minute</Text>
                    </Box> :
                <Box>
                    <Text textAlign={'center'} mb={'20px'} fontWeight={'bold'}>Enter 2FA code</Text>
                    <HStack>
                        <PinInput onChange={handleCodeChange}>
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    </HStack>
                </Box>
            }
            
        </Center>
    )
}