import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	driver: 'better-sqlite',
	schema: './src/lib/server/schema.ts',
	dbCredentials: { url: './data/database.sqlite' },
	out: './drizzle'
});
