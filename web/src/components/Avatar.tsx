import React from 'react';
import { Image, Box } from '@chakra-ui/react';

interface Props {
	d?: string;
	src?: string;
}

export const Avatar : React.FC<Props> = ({d, src}) => {

	return (
			<Image 
				aspectRatio={'1 / 1'} 
				objectFit={'cover'} 
				w={{md: d ? d : "100px", base: "100%"}} 
				h={{md: d ? d : "100px", base: "100%"}} 
				src={src ? src : "/images/default.jpeg"} 
				rounded={'100%'} 
			/>
	)
}
