import { createCookie } from '@remix-run/node';
import { prisma } from './db/driver';
import { User } from '@prisma/client';

const PasswordCookie = createCookie('password', {
	httpOnly: true,
	maxAge: 60 * 60 * 24 * 30 // 30 days
});

export const REDIRECT_PARAM = 'redirect';

/**
 * Intent to deprecate once actual users are created.
 */
function isValidPassword(password: string) {
	if (!process.env.PASSWORD) {
		throw new Error('No password has been set! Aborting!');
	}

	return process.env.PASSWORD === password;
}

export async function getLoginCookie(password: string): Promise<string | null> {
	if (isValidPassword(password)) {
		return await PasswordCookie.serialize(password);
	}

	return null;
}

export async function getOptionalUser(request: Request): Promise<User | null> {
	const password = await PasswordCookie.parse(request.headers.get('Cookie'));

	if (isValidPassword(password)) {
		return await prisma.$transaction(async (tx) => {
			const user = await tx.user.findFirst();

			if (!user) {
				return await tx.user.create({ data: { email: 'nick@nickbreaton.com' } });
			}

			return user;
		});
	}

	return null;
}

export async function getUser(request: Request): Promise<User> {
	const user = await getOptionalUser(request);
	if (user) return user;
	throw new Error('Could not fetch user!');
}

export function redirectFromLogin(request: Request, headers: [string, string][] = []) {
	const url = new URL(request.url);
	const location = url.searchParams.get(REDIRECT_PARAM) ?? '/';

	return new Response(null, {
		status: 303,
		headers: [['location', location], ...headers]
	});
}
