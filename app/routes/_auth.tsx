import { type LoaderFunctionArgs } from '@remix-run/node';
import { getUser } from '~/lib/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
	// default protect layout
	await getUser(request);

	return null;
}
