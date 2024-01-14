import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';

export const pets = sqliteTable('pets', {
	id: integer('id').unique().primaryKey({ autoIncrement: true }).notNull(),
	username: text('username').unique().notNull(),
	name: text('name').notNull()
});

export const Pet = createSelectSchema(pets);
