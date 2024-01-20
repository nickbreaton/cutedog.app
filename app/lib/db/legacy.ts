import { connect } from '@planetscale/database';

const config = {
	host: process.env.PLANETSCALE_HOST,
	username: process.env.PLANETSCALE_USERNAME,
	password: process.env.PLANETSCALE_PASSWORD
};

const planetscale = connect(config);

type Timezone = `-${number}${number}${number}${number}` | `+${number}${number}${number}${number}`;

interface LegacyEntry {
	id: number;
	datetime: string;
	timezone: Timezone;
	quotes: string[];
	lat: number;
	lon: number;
	photoID?: string;
	photoURL?: string;
	description?: string;
	cachedCity?: string;
	cachedState?: string;
	cachedPhotoAspectRatio?: number;
}

export async function getLegacyEntries({ username }: { username: string }) {
	if (username === 'lucy') {
		const { rows } = await planetscale.execute('SELECT * FROM interactions');
		return rows.map((entry) => ({ ...entry, photoURL: entry.photoId })) as LegacyEntry[];
	}
	return [];
}
