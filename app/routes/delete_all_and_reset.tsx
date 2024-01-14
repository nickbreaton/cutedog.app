import { prisma } from '~/lib/db/driver';

export async function loader() {
	await prisma.pets.deleteMany();
	await prisma.pets.create({ data: { name: 'Lucy', username: 'lucy' } });
	return new Response('ok');
}
