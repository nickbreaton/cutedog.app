import { db } from '$lib/server/db';
import { pets } from '$lib/server/schema';
import { pretty } from '$lib/server/response';

export const GET = async () => {
	// Temporarily allow in production

	// if (!import.meta.env.DEV) {
	// 	return error(404);
	// }

	await db.delete(pets);

	await db.insert(pets).values({
		name: 'Lucy',
		username: 'lucy'
	});

	await db.insert(pets).values({
		name: 'Pippy',
		username: 'pippy'
	});

	return pretty(await db.select().from(pets));
};
