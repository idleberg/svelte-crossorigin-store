import { resolve } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
	plugins: [mkcert(), tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			'svelte-crossorigin-store/iframe': resolve(__dirname, '../src/iframe.ts'),
			'svelte-crossorigin-store/window': resolve(__dirname, '../src/window.ts'),
			'svelte-crossorigin-store/broadcast': resolve(__dirname, '../src/broadcast.ts'),
			'svelte-crossorigin-store/popup': resolve(__dirname, '../src/popup.ts'),
		},
	},
});
