import { redirect } from '@remix-run/node';
import { REDIRECT_PARAM, getOptionalUser } from './auth';
import { SITE_ROUTE_REDIRECTS } from './constants';

type MiddlewareFn = ({
	request
}: {
	request: Request;
}) => null | Response | Promise<null | Response>;

const redirectFromFlyHostname: MiddlewareFn = ({ request }) => {
	const url = new URL(request.url);

	if (url.origin.includes('fly.dev')) {
		const location = new URL(url);
		location.hostname = 'beta.cutedog.app';
		return redirect(location.href, { status: 301 });
	}

	return null;
};

const redirectCommonSiteRoutes: MiddlewareFn = async ({ request }) => {
	const url = new URL(request.url);

	const isRedirectRoute = SITE_ROUTE_REDIRECTS.some((route) =>
		url.pathname.startsWith(`/${route}`)
	);

	return isRedirectRoute ? redirect('/s' + url.pathname) : null;
};

const requireAuthentication: MiddlewareFn = async ({ request }) => {
	const url = request ? new URL(request.url) : { pathname: '/', search: '' };

	if (url.pathname === '/s/login') {
		return null;
	}

	const user = await getOptionalUser(request);

	if (user) {
		return null;
	}

	const resolved = [url.pathname, url.search].filter(Boolean).join('?');

	let location = '/s/login';

	if (resolved.length > 1) {
		const params = new URLSearchParams();
		params.set(REDIRECT_PARAM, resolved);
		location += '?' + params.toString();
	}

	return redirect(location);
};

// prettier-ignore
export const middleware: MiddlewareFn[] = [
	redirectFromFlyHostname,
  redirectCommonSiteRoutes,
  requireAuthentication
];
