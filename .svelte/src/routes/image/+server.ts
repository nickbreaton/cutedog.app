import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

export const GET = async () => {
	const stream = createReadStream('./data/IMG_0048.jpeg');
	return new Response(Readable.toWeb(stream) as ReadableStream, {
		headers: { 'Content-Type': 'image/jpeg' }
	});
};
