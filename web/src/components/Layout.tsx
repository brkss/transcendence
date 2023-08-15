import React from 'react';
import { Box, Grid, Container, GridItem } from '@chakra-ui/react';
import { TopBar } from './TopBar';
import { SideBar } from './Sidebar';



export const Layout : React.FC<any> = ({children}) => {


	return (
		<Box>
			<TopBar />
			<Grid templateColumns={'repeat(12, 1fr)'}>
				<GridItem colSpan={1}>
					<SideBar />
				</GridItem>
				<GridItem colSpan={11}>
						{children}
				</GridItem>
			</Grid>
		</Box>
	)
}
