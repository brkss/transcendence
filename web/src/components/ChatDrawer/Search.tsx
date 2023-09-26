import React from 'react';
import { Box, Text, Input } from '@chakra-ui/react';

interface Props {
	change: (txt: string) => void;
}

export const SearchChat : React.FC<Props> = ({change}) => {

	return (
		<Box mt={'20px'} mb={'40px'}>
			<Input variant={'filled'} fontWeight={'bold'} placeholder='find chat...' onChange={(e) => change(e.currentTarget.value)} />
		</Box>
	)
}
