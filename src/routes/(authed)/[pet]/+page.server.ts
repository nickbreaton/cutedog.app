import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	// Temporarily only allow Lucy
	if (params.pet !== 'lucy') {
		error(404, 'pet not found');
	}

	return { pet: params.pet };
};
