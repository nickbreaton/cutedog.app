export function pretty(value: unknown) {
	return new Response(JSON.stringify(value, null, 2), {
		headers: { 'Content-Type': 'application/json' }
	});
}
