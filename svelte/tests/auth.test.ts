import { expect, test } from '@playwright/test';
import { login } from './utils/auth.js';

test.describe('unauthed', () => {
	test('redirects to login maintaining destination', async ({ page }) => {
		await login(page);
		await expect(page.getByText('Hello')).toBeVisible();
	});

	test('shows error message if wrong password', async ({ page }) => {
		await login(page, { password: 'something_wrong' });
		await expect(page.getByText('Invalid password')).toBeVisible();
	});
});

test.describe('redirects away when valid', () => {
	test('redirects to login maintaining destination', async ({ page }) => {
		await login(page);
		await expect(page.getByText('Hello')).toBeVisible();
		await page.goto('/login');
		await expect(page.getByText('Hello')).toBeVisible();
	});
});
