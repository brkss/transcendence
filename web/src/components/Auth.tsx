import React from 'react';
import { useRouter } from 'next/router';
import { getAccessToken } from '@/utils/token';

export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
	const Wrapper = (props: P) => {
		const router = useRouter();
		const token = getAccessToken();

		React.useEffect(() => {
			if(!token){
				router.push(("/auth/login"))
			}
		}, [token, router]);

		return (
			token ? <Component {...props} /> : null
		)
	}
	return Wrapper;
}
