import { redirectFromLogin, getLoginCookie, getOptionalUser } from '~/lib/auth.server';
import { type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { zfd } from 'zod-form-data';

const LoginForm = zfd.formData({
	password: zfd.text()
});

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await getOptionalUser(request);

	if (user) {
		throw redirectFromLogin(request);
	}

	return {};
}

export async function action({ request }: ActionFunctionArgs) {
	const { password } = LoginForm.parse(await request.formData());

	const cookie = await getLoginCookie(password);

	if (!cookie) {
		return { error: 'Incorrect password' };
	}

	throw redirectFromLogin(request, [['Set-Cookie', cookie]]);
}

export default function Component() {
	const { error } = useActionData<typeof action>() ?? {};

	return (
		<Form method="post">
			{error ? <p style={{ color: 'red' }}>{error}</p> : null}
			<input name="password" type="password" />
			<button>login</button>
		</Form>
	);
}
