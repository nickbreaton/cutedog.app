import { type Handle, redirect, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const rewriteProductionHostname: Handle = ({ event, resolve }) => {
	if (event.url.origin.includes('fly.dev')) {
		const location = new URL(event.url);
		location.hostname = 'beta.cutedog.app';
		return redirect(307, location);
	}

	return resolve(event);
};

const guardAdminRoutes: Handle = ({ event, resolve }) => {
	// Leave unprotected for time being
	const isAdminAllowed = true;

	if (!isAdminAllowed && event.url.pathname.startsWith('/admin')) {
		return error(404);
	}

	return resolve(event);
};

export const handle = sequence(rewriteProductionHostname, guardAdminRoutes);
