import { prisma } from '$lib/prisma';
import { error, json } from '@sveltejs/kit';

export const GET = async () => {
	if (!import.meta.env.DEV) {
		return error(404);
	}

	await prisma.pet.upsert({
		where: {
			username: 'lucy'
		},
		create: {
			name: 'Lucy',
			username: 'lucy'
		},
		update: {}
	});

	await prisma.pet.upsert({
		where: {
			username: 'pippy'
		},
		create: {
			name: 'Pippy',
			username: 'pippy'
		},
		update: {}
	});

	return json({ stutus: 'ok' });
};
