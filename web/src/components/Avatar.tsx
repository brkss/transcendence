import React from 'react';
import { Image, Box } from '@chakra-ui/react';

interface Props {
	d?: string;
	src?: string;
}

export const Avatar : React.FC<Props> = ({d, src}) => {


	return (
			<Image objectFit={'cover'} w={d ? d : "100px"} h={d ? d : "100px"} src={src ? src : "/images/default.jpeg"} rounded={'100%'} />
	)
}
