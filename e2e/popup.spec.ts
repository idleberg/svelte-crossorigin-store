import { test, expect, type Page } from "@playwright/test";

const URL = "https://localhost:3030/popup";

function getCounter(page: Page) {
	return page.locator("text=/Current Value: /");
}

function getCounterValue(page: Page) {
	return getCounter(page)
		.textContent()
		.then((text) => {
			const match = text?.match(/Current Value:\s*(-?\d+)/);
			return match ? Number(match[1]) : NaN;
		});
}

test.describe("popup cross-window sync", () => {
	test("clicking Add in parent syncs to popup", async ({ page }) => {
		await page.goto(URL);
		await expect(getCounter(page)).toBeVisible();

		const popupPromise = page.waitForEvent("popup");
		await page.getByRole("button", { name: "Open Popup" }).click();
		const popup = await popupPromise;
		await popup.waitForLoadState();
		await expect(getCounter(popup)).toBeVisible();

		await page.getByRole("button", { name: "Add" }).click();

		const parentValue = await getCounterValue(page);
		await expect(getCounter(popup)).toContainText(
			`Current Value: ${parentValue}`,
		);

		await popup.close();
	});

	test("clicking Add in popup syncs to parent", async ({ page }) => {
		await page.goto(URL);
		await expect(getCounter(page)).toBeVisible();

		const popupPromise = page.waitForEvent("popup");
		await page.getByRole("button", { name: "Open Popup" }).click();
		const popup = await popupPromise;
		await popup.waitForLoadState();
		await expect(getCounter(popup)).toBeVisible();

		await popup.getByRole("button", { name: "Add" }).click();

		const popupValue = await getCounterValue(popup);
		await expect(getCounter(page)).toContainText(
			`Current Value: ${popupValue}`,
		);

		await popup.close();
	});

	test("reset in parent syncs to popup", async ({ page }) => {
		await page.goto(URL);

		const popupPromise = page.waitForEvent("popup");
		await page.getByRole("button", { name: "Open Popup" }).click();
		const popup = await popupPromise;
		await popup.waitForLoadState();

		await page.getByRole("button", { name: "Add" }).click();
		await expect(getCounter(page)).not.toContainText("Current Value: 0");

		await page.getByRole("button", { name: "reset" }).click();
		await expect(getCounter(page)).toContainText("Current Value: 0");
		await expect(getCounter(popup)).toContainText("Current Value: 0");

		await popup.close();
	});
});
