import React from 'react';
import { 
	Box,
	Alert,
	AlertIcon,
	AlertTitle,
} from '@chakra-ui/react'

interface Props {
	err: string;
}

export const Error: React.FC<Props> = ({err}) => {


	return (
		<Box mb={'20px'} >
			<Alert borderRadius={'10px'} status='error'>
				<AlertIcon />
				{err}
			</Alert>
		</Box>
	)
}
