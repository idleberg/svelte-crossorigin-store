<script lang="ts">
	import { createWritableStore } from "svengen/broadcast";
	import Store from "$lib/Store.svelte";

	const store = createWritableStore<number>(0);
</script>

<svelte:head>
	<title>Broadcast | svengen</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-4 text-2xl font-bold">Broadcast Playground</h1>
	<p class="mb-6">
		Open this page in multiple tabs, then change the counter in one tab to see
		it sync across all tabs via <code
			class="rounded bg-gray-100 px-1 dark:bg-gray-800">BroadcastChannel</code
		>.
	</p>
	<Store {store} label="Tab" />
</div>
