import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	use: {
		ignoreHTTPSErrors: true,
	},
	webServer: [
		{
			command: 'cd playground && npx vite dev --strictPort --port 3030',
			port: 3030,
			reuseExistingServer: true,
		},
		{
			command: 'cd playground && npx vite dev --strictPort --port 3031',
			port: 3031,
			reuseExistingServer: true,
		},
		{
			command: 'cd playground && npx vite dev --strictPort --port 3032',
			port: 3032,
			reuseExistingServer: true,
		},
	],
});
