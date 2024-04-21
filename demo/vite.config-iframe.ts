import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        PAGE_TYPE: JSON.stringify('iframe')
    },
    plugins: [
        mkcert(),
        svelte(),
    ],
    root: resolve(process.cwd(), 'demo'),
});
