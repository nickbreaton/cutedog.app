import type { Cookies } from '@sveltejs/kit';
import { PASSWORD } from '$env/static/private';

const AUTH_COOKIE = 'password';

export function isAuthed(cookies: Cookies) {
	return PASSWORD.length > 0 && cookies.get(AUTH_COOKIE) === PASSWORD;
}

export function authenticate(password: string, cookies: Cookies) {
	if (PASSWORD.length > 0 && password === PASSWORD) {
		cookies.set(AUTH_COOKIE, password, { path: '/' });
	}
	return isAuthed(cookies);
}
