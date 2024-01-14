import { type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Form, Outlet } from '@remix-run/react';
import { getUser, redirectToLogin } from '~/lib/auth';

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await getUser(request);

	if (!user) {
		throw redirectToLogin(request);
	}

	return user;
}
