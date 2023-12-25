import { isAuthed, authenticate } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = (event) => {
	if (isAuthed(event.cookies)) {
		redirect(307, '/');
	}
};

export const actions: Actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const password = String(data.get('password'));

		authenticate(password, event.cookies);

		if (!isAuthed(event.cookies)) {
			return { error: 'Invalid password' };
		}

		return {};
	}
};
