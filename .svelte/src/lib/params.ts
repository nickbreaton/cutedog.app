export function withParams(pathname: string, params: URLSearchParams) {
	return params.size > 0 ? `${pathname}?${params}` : pathname;
}
