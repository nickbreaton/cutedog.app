import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { redirect } from './lib/response';

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])
];

export const meta: MetaFunction = () => {
	return [{ title: 'CuteDog.app' }];
};

export function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);

	if (url.origin.includes('fly.dev')) {
		const location = new URL(url);
		location.hostname = 'beta.cutedog.app';
		throw redirect(location, { status: 301 });
	}

	return null;
}

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="color-scheme" content="light dark" />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
