import { type Handle, redirect } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	if (event.url.origin.includes('fly.dev')) {
		const location = new URL(event.url);
		location.hostname = 'beta.cutedog.app';
		return redirect(307, location);
	}

	return resolve(event);
};
