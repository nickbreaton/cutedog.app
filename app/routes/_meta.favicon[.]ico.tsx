import { renderToString } from 'react-dom/server';

export function loader() {
	const content = (
		<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16">
			<filter id="grayscale">
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<text x="0" y="14" filter={process.env.NODE_ENV === 'production' ? '' : 'url(#grayscale)'}>
				🐶
			</text>
		</svg>
	);

	return new Response(renderToString(content), {
		headers: { 'Content-Type': 'image/svg+xml' }
	});
}
