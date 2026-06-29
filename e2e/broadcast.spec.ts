import { expect, test } from '@playwright/test';

const URL = 'https://localhost:3030/broadcast';

function getCounter(page: import('@playwright/test').Page) {
	return page.locator('text=/Current Value: /');
}

function getCounterValue(page: import('@playwright/test').Page) {
	return getCounter(page)
		.textContent()
		.then((text) => {
			const match = text?.match(/Current Value:\s*(-?\d+)/);
			return match ? Number(match[1]) : Number.NaN;
		});
}

test.describe('broadcast cross-tab sync', () => {
	test('updating value in one tab syncs to another', async ({ browser }) => {
		const context = await browser.newContext({ ignoreHTTPSErrors: true });
		const page1 = await context.newPage();
		const page2 = await context.newPage();

		await page1.goto(URL);
		await page2.goto(URL);

		await expect(getCounter(page1)).toBeVisible();
		await expect(getCounter(page2)).toBeVisible();

		await page1.getByRole('button', { name: 'Add' }).click();

		const page1Value = await getCounterValue(page1);
		await expect(getCounter(page2)).toContainText(`Current Value: ${page1Value}`);

		await context.close();
	});

	test('subtract in one tab reflects in the other', async ({ browser }) => {
		const context = await browser.newContext({ ignoreHTTPSErrors: true });
		const page1 = await context.newPage();
		const page2 = await context.newPage();

		await page1.goto(URL);
		await page2.goto(URL);

		await expect(getCounter(page1)).toBeVisible();
		await expect(getCounter(page2)).toBeVisible();

		await page1.getByRole('button', { name: 'Subtract' }).click();

		const page1Value = await getCounterValue(page1);
		await expect(getCounter(page2)).toContainText(`Current Value: ${page1Value}`);

		await context.close();
	});

	test('reset in one tab syncs to the other', async ({ browser }) => {
		const context = await browser.newContext({ ignoreHTTPSErrors: true });
		const page1 = await context.newPage();
		const page2 = await context.newPage();

		await page1.goto(URL);
		await page2.goto(URL);

		await page1.getByRole('button', { name: 'Add' }).click();
		await expect(getCounter(page1)).not.toContainText('Current Value: 0');

		await page1.getByRole('button', { name: 'reset' }).click();
		await expect(getCounter(page1)).toContainText('Current Value: 0');
		await expect(getCounter(page2)).toContainText('Current Value: 0');

		await context.close();
	});
});
