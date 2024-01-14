import { Link, useLoaderData } from '@remix-run/react';
import { prisma } from '~/lib/db/driver';

export function loader() {
	return prisma.pet.findMany({ select: { username: true, name: true } });
}

export default function Component() {
	const pets = useLoaderData<typeof loader>();
	return (
		<ul>
			{pets.map((pet) => (
				<li key={pet.username}>
					<Link to={pet.username}>{pet.name}</Link>
				</li>
			))}
		</ul>
	);
}
