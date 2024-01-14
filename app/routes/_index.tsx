import { redirect } from '~/lib/response';

export function loader() {
	throw redirect('/lucy');
}
