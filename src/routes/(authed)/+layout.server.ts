import { isAuthed } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { withParams } from '$lib/params';

export const load: LayoutServerLoad = (event) => {
	if (!isAuthed(event.cookies)) {
		const params =
			event.url.pathname.length > 1
				? new URLSearchParams([['redirect', event.url.pathname]])
				: new URLSearchParams();
		return redirect(307, withParams('/login', params));
	}
};
