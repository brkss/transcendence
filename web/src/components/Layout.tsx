import React from 'react';
import { useRouter } from 'next/router'
import { Box, Grid, Container, GridItem, useDisclosure } from '@chakra-ui/react';
import { TopBar } from './TopBar';
import { SideBar } from './Sidebar';

// Drawers --- 
import { FriendsDrawer } from './FriendsDrawer';
import { ChatDrawer } from './ChatDrawer';

const _singnals = [
	{
		name: "friends"
	},
	{
		name: "chat",
	},
	{
		name: "board",
	},
	{
		name: "game",
	},
	{
		name: "settings",
	},
	{
		name: "logout"
	}
]


export const Layout : React.FC<any> = ({children}) => {

	
	const router = useRouter();
	const showFriends = useDisclosure();
	const showGame = useDisclosure();
	const showBoard = useDisclosure();
	const showSettings = useDisclosure();
	const showChat = useDisclosure();

	const handleSig = (sig: string) => {

		console.log("handle sig : ", sig);
		switch (sig) {
			case "friends":
				showFriends.onOpen()
				break;
			case "game":
				showGame.onOpen()
				break;
			case "settings":
				showSettings.onOpen()
				break;
			case "chat":
				showChat.onOpen()
				break;
			case "board":
				router.push("/leaderboard")
				break;
			default:
				break;
		}
	}

	return (
		<Box>
			<TopBar />
			<Grid templateColumns={'repeat(12, 1fr)'}>
				<GridItem colSpan={1}>
					<SideBar signal={(sig: string) => handleSig(sig) } />
				</GridItem>
				<GridItem colSpan={11}>
					{children}
				</GridItem>
			</Grid>
			{  <FriendsDrawer isOpen={showFriends.isOpen} onClose={showFriends.onClose} /> }			
			{ <ChatDrawer isOpen={showChat.isOpen}  onClose={showChat.onClose} /> }
		</Box>
	)
}
