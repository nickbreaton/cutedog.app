import { Readable } from 'node:stream';
import { zip } from 'compressing';

export const GET = async () => {
	const stream = new zip.Stream();
	stream.addEntry('./data');
	return new Response(Readable.toWeb(stream) as ReadableStream, {
		headers: { 'Content-Type': 'application/zip' }
	});
};
