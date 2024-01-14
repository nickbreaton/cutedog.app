import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const pets = sqliteTable('pets', {
	id: integer('id').unique().primaryKey({ autoIncrement: true }).notNull(),
	username: text('username').unique(),
	name: text('name')
});
