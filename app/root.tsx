import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	redirect
} from '@remix-run/react';
import './root.css';

export const meta: MetaFunction = () => {
	return [{ title: 'CuteDog.app' }];
};

export const links: LinksFunction = () => {
	return [{ rel: 'icon', href: 'https://fav.farm/🐶' }];
};

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
