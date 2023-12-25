import { type Page } from '@playwright/test';

interface LoginOptions {
	at?: string;
	password?: string;
}

export async function login(page: Page, { at = '/', password }: LoginOptions = {}) {
	await page.goto(at);
	await page.getByLabel('Password').fill(password ?? process.env.PASSWORD!);
	await page.getByLabel('Password').press('Enter');
}
