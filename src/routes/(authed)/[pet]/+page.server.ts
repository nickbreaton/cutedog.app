import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const pet = await prisma.pet.findUnique({ where: { username: params.pet } });

	if (!pet) {
		error(404, 'pet not found');
	}

	return pet;
};
