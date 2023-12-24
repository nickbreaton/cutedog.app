import { expect, test } from '@playwright/test';
import { config as dotenv } from 'dotenv';

test.beforeAll(() => {
	dotenv({ path: '.env.local' });
});

test.describe('unauthed', () => {
	test('redirects to login maintaining destination', async ({ page }) => {
		await page.goto('/lucy');
		await page.getByLabel('Password').fill(process.env.PASSWORD!);
		await page.getByLabel('Password').press('Enter');
		await expect(page.getByText('Hello')).toBeVisible();
	});

	test('shows error message if wrong password', async ({ page }) => {
		await page.goto('/lucy');
		await page.getByLabel('Password').fill('notthepassword');
		await page.getByLabel('Password').press('Enter');
		await expect(page.getByText('Invalid password')).toBeVisible();
	});
});

test.describe('redirects away when valid', () => {
	test('redirects to login maintaining destination', async ({ page }) => {
		await page.goto('/lucy');
		await page.getByLabel('Password').fill(process.env.PASSWORD!);
		await page.getByLabel('Password').press('Enter');
		await expect(page.getByText('Hello')).toBeVisible();
		await page.goto('/login');
		await expect(page.getByText('Hello')).toBeVisible();
	});
});
