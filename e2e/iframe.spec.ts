import { test, expect, type Page, type FrameLocator } from "@playwright/test";

const MAIN_URL = "https://localhost:3030/iframe";

function getCounter(context: Page | FrameLocator) {
	return context.locator("text=/Current Value: /");
}

function getCounterValue(context: Page | FrameLocator) {
	return getCounter(context).textContent().then((text) => {
		const match = text?.match(/Current Value:\s*(-?\d+)/);
		return match ? Number(match[1]) : NaN;
	});
}

test.describe("iframe cross-origin sync", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(MAIN_URL);
		await expect(getCounter(page)).toBeVisible();
	});

	test("parent and iframes all show initial value", async ({ page }) => {
		const iframe1 = page.frameLocator('iframe[title="iFrame #1"]');
		const iframe2 = page.frameLocator('iframe[title="iFrame #2"]');

		await expect(getCounter(iframe1)).toBeVisible();
		await expect(getCounter(iframe2)).toBeVisible();

		const parentValue = await getCounterValue(page);
		const iframe1Value = await getCounterValue(iframe1);
		const iframe2Value = await getCounterValue(iframe2);

		expect(parentValue).toBe(iframe1Value);
		expect(parentValue).toBe(iframe2Value);
	});

	test("clicking Add in parent syncs to iframes", async ({ page }) => {
		const iframe1 = page.frameLocator('iframe[title="iFrame #1"]');
		const iframe2 = page.frameLocator('iframe[title="iFrame #2"]');

		const initialValue = await getCounterValue(page);

		await page.getByRole("button", { name: "Add" }).click();

		await expect(getCounter(page)).toContainText(`Current Value: ${initialValue + 1}`);
		await expect(getCounter(iframe1)).toContainText(`Current Value: ${initialValue + 1}`);
		await expect(getCounter(iframe2)).toContainText(`Current Value: ${initialValue + 1}`);
	});

	test("clicking Add in iframe syncs to parent and other iframe", async ({ page }) => {
		const iframe1 = page.frameLocator('iframe[title="iFrame #1"]');
		const iframe2 = page.frameLocator('iframe[title="iFrame #2"]');

		const initialValue = await getCounterValue(page);

		await iframe1.getByRole("button", { name: "Add" }).click();

		await expect(getCounter(page)).toContainText(`Current Value: ${initialValue + 1}`);
		await expect(getCounter(iframe1)).toContainText(`Current Value: ${initialValue + 1}`);
		await expect(getCounter(iframe2)).toContainText(`Current Value: ${initialValue + 1}`);
	});

	test("clicking Reset in parent syncs to iframes", async ({ page }) => {
		const iframe1 = page.frameLocator('iframe[title="iFrame #1"]');
		const iframe2 = page.frameLocator('iframe[title="iFrame #2"]');

		await page.getByRole("button", { name: "Add" }).click();
		await expect(getCounter(page)).not.toContainText("Current Value: 0");

		await page.getByRole("button", { name: "reset" }).click();

		await expect(getCounter(page)).toContainText("Current Value: 0");
		await expect(getCounter(iframe1)).toContainText("Current Value: 0");
		await expect(getCounter(iframe2)).toContainText("Current Value: 0");
	});

	test("multiple clicks accumulate and sync", async ({ page }) => {
		const iframe1 = page.frameLocator('iframe[title="iFrame #1"]');
		const iframe2 = page.frameLocator('iframe[title="iFrame #2"]');

		// Reset first
		await page.getByRole("button", { name: "reset" }).click();
		await expect(getCounter(page)).toContainText("Current Value: 0");

		// Click Add 3 times in parent
		for (let i = 0; i < 3; i++) {
			await page.getByRole("button", { name: "Add" }).click();
		}

		await expect(getCounter(page)).toContainText("Current Value: 3");
		await expect(getCounter(iframe1)).toContainText("Current Value: 3");
		await expect(getCounter(iframe2)).toContainText("Current Value: 3");

		// Click Subtract in iframe2
		await iframe2.getByRole("button", { name: "Subtract" }).click();

		await expect(getCounter(page)).toContainText("Current Value: 2");
		await expect(getCounter(iframe1)).toContainText("Current Value: 2");
		await expect(getCounter(iframe2)).toContainText("Current Value: 2");
	});
});
