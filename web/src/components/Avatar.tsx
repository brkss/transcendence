import React from 'react';
import { Image, Box } from '@chakra-ui/react';

interface Props {
	d?: string;
	src?: string;
	clicked?: () => void;
	rounded?: boolean
}

export const Avatar : React.FC<Props> = ({d, src, clicked, rounded}) => {

	return (
			<Image
				alt=""
				onClick={clicked}
				cursor={clicked ? 'pointer' : 'default'}
				_hover={{opacity: clicked ? .7 : 1, transition: '.3s'}}
				transition={'.3s'}
				aspectRatio={'1 / 1'} 
				objectFit={'cover'} 
				w={{md: d ? d : "100px", base: "100%"}} 
				h={{md: d ? d : "100px", base: "100%"}} 
				src={src ? src : "/images/default.jpeg"} 
				rounded={rounded ? '15px' : '100%'} 
			/>
	)
}
