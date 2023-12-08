import React from 'react';
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Heading,
	Box,
	Center,
    FormControl,
    FormLabel,
	Input,
    Button,
	Grid,
	GridItem,
	useToast,
} from '@chakra-ui/react'
import { Avatar } from '../Avatar';
import { uploadAvatar } from '@/utils/services'

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const SettingsDrawer : React.FC<Props> = ({isOpen, onClose}) => {

	const avatarInputRef = React.useRef<any>();
	const [avatar, setAvatar] = React.useState<File | null>(null);
	const [user, setUser] = React.useState<any>(null);
	const toast = useToast();
	
	const chnageAvatar = () => {
		if(!avatarInputRef.current)
			return;
		avatarInputRef.current.click();
	}

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if(e.currentTarget.files){
			setAvatar(e.currentTarget.files[0])
		}
	}

	React.useEffect(() => {
		(() => {
			const user = JSON.parse(localStorage.getItem("ME") || "");
			if(user){
				setUser(user);
				console.log("me : ", user);
			}
		})()
	}, []);

	

	const handleSave = () => {
		if(avatar){
			const fd = new FormData();
			fd.append('file', avatar);
			uploadAvatar(fd).then(response => {
				console.log("change avatar response : ", response);
				toast({
					status: 'success',
					title: "You've changed your avatar",
					duration: 9000,
					isClosable: true
				})
			}).catch(e => {
				console.log("change user avatar error : ", e);
				toast({
					status: 'error',
					title: "Something went wrong can't change user's avatar",
					duration: 9000,
					isClosable: true
				})
			})
		}
	}

	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size={'md'}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader></DrawerHeader>

				<DrawerBody>
					<Heading>Edit Profile</Heading>
					<Center h={'100%'}>
						<Box w={'100%'}>
							<Center h={'200px'} textAlign={'center'}>
								<Avatar src={avatar ? URL.createObjectURL(avatar) : user?.avatar} clicked={chnageAvatar} />
								<input type="file" onChange={handleAvatarChange} hidden ref={avatarInputRef} />
							</Center>
							<Grid templateColumns={'repeat(12, 1fr)'} gap={3}>
								<GridItem colSpan={{md: 12, base: 12}}>
									<FormControl>
										<FormLabel fontSize={'15px'} fontWeight={'bold'} mb={'5px'}>Name</FormLabel>
										
										<Input variant={'filled'} />
									</FormControl>
								</GridItem>
								<GridItem colSpan={{md: 12, base: 12}}>
									<FormControl mt={'0'}>
										<FormLabel fontSize={'15px'} fontWeight={'bold'} mb={'5px'}>Username</FormLabel>
										<Input variant={'filled'} />
									</FormControl>
								</GridItem>
							</Grid>
						</Box>						
					</Center>
					
				</DrawerBody>

				<DrawerFooter>
					<Button mr={'10px'} onClick={handleSave}>Save</Button>
					<Button variant={'ghost'}>Cancel</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
