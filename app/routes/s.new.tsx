import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { zfd } from 'zod-form-data';
import { getUser } from '~/lib/auth';
import { prisma } from '~/lib/db/driver';

const actionSchema = zfd.formData({
	name: zfd.text().refine((name) => name.match(/^[a-zA-Z0-9]+$/)),
	username: zfd.text()
});

export async function action({ request }: ActionFunctionArgs) {
	const user = await getUser(request);
	const data = actionSchema.parse(await request.formData());
	await prisma.pet.create({
		data: {
			...data,
			owners: {
				connect: { id: user.id }
			}
		}
	});
	return redirect('/');
}

export default function Component() {
	return (
		<Form method="post">
			<label>
				Name
				<input name="name" />
			</label>
			<hr />
			<label>
				Username
				<input name="username" />
			</label>
			<button>create</button>
		</Form>
	);
}
