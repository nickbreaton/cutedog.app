import { prisma } from '~/lib/db/driver';

export async function loader() {
	await prisma.pet.deleteMany();
	await prisma.pet.create({ data: { name: 'Lucy', username: 'lucy' } });
	return new Response('ok');
}
