CREATE TABLE `pets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text,
	`name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pets_id_unique` ON `pets` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `pets_username_unique` ON `pets` (`username`);