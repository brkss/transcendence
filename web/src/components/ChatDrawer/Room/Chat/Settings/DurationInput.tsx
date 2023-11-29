import React from 'react';
import { HStack, Button, Input, useNumberInput, Flex } from '@chakra-ui/react';

interface Props {
    changedDuration: (dur: number) => void;
}

export const DurationInput : React.FC<Props> = ({changedDuration}) => {
    
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
        onChange(_, valueAsNumber) {
            changedDuration(valueAsNumber);
        },
        step: 1,
        defaultValue: 5,
        min: 1,
        max: 30,
        precision: 0,
    })
    
    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps()
    
    return (
        <Flex maxW='200px' >
            <Button mr={'5px'} size={'sm'} {...inc}>+</Button>
            <Input fontWeight={'bold'} textAlign={'center'} {...input} size={'sm'} />
            <Button ml={'5px'} size={'sm'} {...dec}>-</Button>
        </Flex>
    )
      
}