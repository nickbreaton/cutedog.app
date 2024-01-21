import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/lib/auth.server';
import { SITE_ROUTE_REDIRECTS } from '~/lib/constants';
import { prisma } from '~/lib/db/driver';
import { getLegacyEntries } from '~/lib/db/legacy';
import { redirect } from '~/lib/response';

export async function loader({ request, params }: LoaderFunctionArgs) {
	// TODO: eventually use user, but for now guard route
	await getUser(request);

	const url = new URL(request.url);
	const isRedirectRoute = SITE_ROUTE_REDIRECTS.some((route) =>
		url.pathname.startsWith(`/${route}`)
	);

	if (isRedirectRoute) {
		const next = new URL({ ...url, pathname: '/s' + url.pathname });
		throw redirect(next, { status: 307 });
	}

	const [pet, entries] = await Promise.all([
		prisma.pet.findFirst({ where: { username: params.pet! } }),
		getLegacyEntries({ username: params.pet! })
	]);

	if (!pet) {
		throw new Response(null, { status: 404 });
	}

	return { pet, entries };
}

export default function Pet() {
	const { pet, entries } = useLoaderData<typeof loader>();
	const { name } = pet;

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">{name}</h1>
			<div className="space-y-4">
				{entries.map((entry) => (
					<article key={entry.id} className="space-y-2">
						<h2 style={{ margin: 0 }}>{entry.quotes}</h2>
						<p>
							{entry.cachedCity} • {entry.datetime}
						</p>
					</article>
				))}
			</div>
		</div>
	);
}
