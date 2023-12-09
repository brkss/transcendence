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
import { updateUserProfile, uploadAvatar } from '@/utils/services'

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const SettingsDrawer : React.FC<Props> = ({isOpen, onClose}) => {

	const avatarInputRef = React.useRef<any>();
	const [avatar, setAvatar] = React.useState<File | null>(null);
	const [user, setUser] = React.useState<any>(null);
	const [form, setForm] = React.useState<any>({});
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

	const handleForm = (key: string, val: string) => {
		setForm({
			...form,
			[key]: val
		})
	}

	

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
		
		if(form && form.username && form.name){
			updateUserProfile(form.name, form.username).then(response => {
				console.log("update user profile : ", response);
			}).then(e => {
				console.log("error : ", e);
				toast({
					status: 'error',
					title: "Something went wrong can't change user's data",
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
										
										<Input value={form.name || user?.fullName || ""} onChange={(e) => handleForm("name", e.currentTarget.value)} variant={'filled'} />
									</FormControl>
								</GridItem>
								<GridItem colSpan={{md: 12, base: 12}}>
									<FormControl mt={'0'}>
										<FormLabel fontSize={'15px'} fontWeight={'bold'} mb={'5px'}>Username</FormLabel>
										<Input value={form.username || user?.username || ""} onChange={(e) => handleForm("username", e.currentTarget.value)} variant={'filled'} />
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
