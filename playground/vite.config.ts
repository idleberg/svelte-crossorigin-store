import { resolve } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
	plugins: [mkcert(), tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			'svengen/iframe': resolve(__dirname, '../src/iframe.ts'),
			'svengen/window': resolve(__dirname, '../src/window.ts'),
			'svengen/broadcast': resolve(__dirname, '../src/broadcast.ts'),
			'svengen/popup': resolve(__dirname, '../src/popup.ts'),
		},
	},
});
