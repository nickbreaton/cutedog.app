import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
// import { eq } from 'drizzle-orm';
import { getUser } from '~/lib/auth.server';
import { prisma } from '~/lib/db/driver';
// import { pets } from '~/lib/db/schema';

export async function loader({ request, params }: LoaderFunctionArgs) {
	// TODO: eventually use user, but for now guard route
	await getUser(request);

	const pet = await prisma.pets.findFirst({ where: { username: params.pet! } });

	if (!pet) {
		throw new Response(null, { status: 404 });
	}

	return pet;
}

export default function Pet() {
	const { name } = useLoaderData<typeof loader>();

	return <h1>{name}</h1>;
}
