import { redirect } from '@sveltejs/kit';

export function load() {
	// Redirect to /lucy until multipet model is implemented
	return redirect(307, '/lucy');
}
