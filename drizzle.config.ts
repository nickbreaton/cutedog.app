import { defineConfig } from 'drizzle-kit';
import { mkdirSync as mkdir } from 'node:fs';

mkdir('./data', { recursive: true });

export default defineConfig({
	driver: 'better-sqlite',
	schema: './src/lib/server/schema.ts',
	dbCredentials: { url: './data/database.sqlite' },
	out: './drizzle'
});
