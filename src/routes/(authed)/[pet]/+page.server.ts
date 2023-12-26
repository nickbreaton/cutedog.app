import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pets } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const [pet] = await db.select().from(pets).where(eq(pets.username, params.pet));

	if (!pet) {
		error(404, 'pet not found');
	}

	return pet;
};
