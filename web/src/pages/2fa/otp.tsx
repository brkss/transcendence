import { HStack, Center, Box, Text, PinInput, PinInputField } from '@chakra-ui/react';


export default function Otp(){


    return (
        <Center h={'100vh'}>
            <Box>
                <Text textAlign={'center'} mb={'20px'} fontWeight={'bold'}>Enter the code</Text>
                <HStack>
                    <PinInput>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                    </PinInput>
                </HStack>
            </Box>
        </Center>
    )
}