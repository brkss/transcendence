import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';

interface Props {
    select: (mode: string) => void;
}

export const GameMode : React.FC<Props> = ({select}) => {

    const [selected, setSelected] = React.useState("NORMAL")
    
    const handleSelect = (mode: string) => {
        setSelected(mode);
        select(mode);
    }


    return (
        <Box mb={'10px'} zIndex={9999} pos={'relative'}>
            <Flex justifyContent={'center'} >
                <Box 
                    cursor={'pointer'}
                    mr={'10px'} 
                    bg={selected === "NORMAL" ? "black" : "gray.100"}  
                    color={selected === "NORMAL" ? "white" : "black"} 
                    onClick={() => handleSelect("NORMAL") }
                    p={'10px 20px'}
                    rounded={'13px'}
                >
                    <Text>Normal Mode</Text>
                </Box>
                <Box 
                    cursor={'pointer'}
                    bg={selected === "NUKE" ? "black" : "gray.100"}  
                    color={selected === "NUKE" ? "white" : "black"}  
                    onClick={() => handleSelect("NUKE") } 
                    p={'10px 20px'}
                    rounded={'13px'}
                >
                    <Text>Nuke Mode</Text>
                </Box>
            </Flex>
        </Box>
    )
}