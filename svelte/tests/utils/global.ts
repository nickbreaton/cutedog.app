import { config as dotenv } from 'dotenv';

export default function () {
	dotenv({ path: '.env.local' });
}
