import React from "react";
import { Box, Text, Center } from "@chakra-ui/react";
import { IoIosArrowUp } from "react-icons/io";
import { SiRiotgames } from "react-icons/si";

import { motion } from "framer-motion";
import { BsChatLeftDots } from "react-icons/bs";
import { IoGameControllerOutline } from "react-icons/io5";
import { FiUsers, FiSettings, FiLogOut } from "react-icons/fi";
import { MdOutlineLeaderboard } from "react-icons/md";
import { usePathname } from 'next/navigation';

const _items = [
  {
    name: "chat",
    Icon: BsChatLeftDots,
  },
  {
    name: "game",
    Icon: IoGameControllerOutline,
  },
  // {
  //   name: "arcade game",
  //   Icon: SiRiotgames,
  // },
  {
    name: "board",
    Icon: MdOutlineLeaderboard,
  },
  {
    name: "friends",
    Icon: FiUsers,
  },
  {
    name: "Settings",
    Icon: FiSettings,
  },
  // {
  //   name: "Logout",
  //   Icon: FiLogOut,
  // },
];

interface Props {
  signal: (sig: string) => void;
}

export const SideBar: React.FC<Props> = ({ signal }) => {
  const [isShown, setIsShown] = React.useState(false);

  const path = usePathname();

  if(path === "/game")
    return <></>

  return (
		<Box display={'flex'} flexDir={'column'} alignItems={'center'} pos="relative" zIndex={995} flexDirection={{md: 'column', base: 'row'}} position={{md: 'relative', base: 'fixed'}} w={'100%'} justifyContent={{md: 'inherit', base: 'space-between'}} p={'10px 20px'} bg={{md: "transparent", base: 'white'}} bottom={0}>
				{
					_items.map(({name, Icon}, key) => (
						<Box onClick={() => signal(name.toLowerCase())} textAlign={'center'} key={key} mb={{md: '40px', base: '0'}} transition={'.3s'} cursor={'pointer'} _hover={{transform: 'scale(.95)', transition: '.3s'}}>
							<Center h={'45px'} w={'45px'} rounded={'16px'} bg={{md: 'black', base: "white"}} m={'auto'} color={{md: 'white', base: "black"}} >
								<Icon  size={'15px'} />	
							</Center>
							<Text fontWeight={'bold'} fontSize={{md: '13px', base: "11px"}}>{name}</Text>
						</Box>
					))
				}
		</Box>
	) 
};
