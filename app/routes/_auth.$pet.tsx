import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/lib/auth.server';
import { Stack } from '~/lib/components/Stack';
import { prisma } from '~/lib/db/driver';
import { getLegacyEntries } from '~/lib/db/legacy';
// import { pets } from '~/lib/db/schema';

export async function loader({ request, params }: LoaderFunctionArgs) {
	// TODO: eventually use user, but for now guard route
	await getUser(request);

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
		<div>
			<h1>{name}</h1>
			<Stack gap={1}>
				{entries.map((entry) => (
					<article key={entry.id}>
						<Stack gap={0.5}>
							<h2 style={{ margin: 0 }}>{entry.quotes}</h2>
							<p>
								{entry.cachedCity} • {entry.datetime}
							</p>
						</Stack>
					</article>
				))}
			</Stack>
		</div>
	);
}
