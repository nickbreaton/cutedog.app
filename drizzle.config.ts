import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	driver: 'better-sqlite',
	schema: './app/lib/tables.server.ts',
	dbCredentials: { url: './data/database.sqlite' },
	out: './drizzle'
});
