import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/lib/db/driver';
import { getLegacyEntries } from '~/lib/db/legacy';

export async function loader({ params }: LoaderFunctionArgs) {
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
