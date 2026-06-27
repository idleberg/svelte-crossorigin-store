import { expect, test } from '@playwright/test';

const URL = 'https://localhost:3030/window';

test.describe('window same-page sync', () => {
	test('typing text and clicking Send triggers third-party alert', async ({ page }) => {
		await page.goto(URL);

		const dialogPromise = page.waitForEvent('dialog');

		await page.getByRole('textbox').fill('Hello from store!');
		await page.getByRole('button', { name: 'Send' }).click();

		const dialog = await dialogPromise;
		expect(dialog.message()).toBe('Hello from store!');
		await dialog.accept();
	});

	test('sending different messages triggers separate alerts', async ({ page }) => {
		await page.goto(URL);

		let dialogPromise = page.waitForEvent('dialog');
		await page.getByRole('textbox').fill('first');
		await page.getByRole('button', { name: 'Send' }).click();
		let dialog = await dialogPromise;
		expect(dialog.message()).toBe('first');
		await dialog.accept();

		dialogPromise = page.waitForEvent('dialog');
		await page.getByRole('textbox').fill('second');
		await page.getByRole('button', { name: 'Send' }).click();
		dialog = await dialogPromise;
		expect(dialog.message()).toBe('second');
		await dialog.accept();
	});
});
