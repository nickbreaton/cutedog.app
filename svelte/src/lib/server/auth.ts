import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const AUTH_COOKIE = 'password';

export function isAuthed(cookies: Cookies) {
	return env.PASSWORD.length > 0 && cookies.get(AUTH_COOKIE) === env.PASSWORD;
}

export function authenticate(password: string, cookies: Cookies) {
	if (env.PASSWORD.length > 0 && password === env.PASSWORD) {
		cookies.set(AUTH_COOKIE, password, { path: '/' });
	}
	return isAuthed(cookies);
}
