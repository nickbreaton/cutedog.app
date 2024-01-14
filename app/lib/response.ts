export function redirect(location: string | URL, { status = 303 } = {}) {
	return new Response(null, {
		status,
		headers: { Location: location.toString() }
	});
}
