<script lang="ts">
	import { createPopupStore } from "svengen/popup";
	import Store from "$lib/Store.svelte";

	const { store, open } = createPopupStore<number>(0, {
		url: "/popup/child",
		allowedOrigins: ["*"],
	});
</script>

<svelte:head>
	<title>Popup | svengen</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-4 text-2xl font-bold">Popup Playground</h1>
	<p class="mb-6">
		Click "Open Popup" to spawn a popup window, then change the counter in
		either window to see the state sync via <code
			class="rounded bg-gray-100 px-1 dark:bg-gray-800">postMessage</code
		>.
	</p>

	<Store {store} label="Parent" />

	<div class="mt-4">
		<button
			class="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
			onclick={() => open()}>Open Popup</button
		>
	</div>
</div>
