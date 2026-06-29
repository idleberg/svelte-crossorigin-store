<script>
import '../app.css';
import { page } from '$app/state';
import Nav from '$lib/Nav.svelte';

let { children } = $props();

const embeddedPaths = ['/iframe/frame', '/popup/child'];
let isEmbedded = $derived(embeddedPaths.some((p) => page.url.pathname.startsWith(p)));
let isHome = $derived(page.url.pathname === '/');
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
	{#if !isEmbedded && !isHome}
		<Nav />
	{/if}
	{@render children()}
</div>
