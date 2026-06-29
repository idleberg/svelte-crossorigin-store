<script lang="ts">
	import { createWritableStore } from "svengen/iframe";
	import Store from "$lib/Store.svelte";

	const store = createWritableStore<number>(1, {
		onChange: (value) => {
			localStorage.setItem("counter", String(value));
		},
	});
</script>

<svelte:head>
	<title>iFrame | svengen</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-4 text-2xl font-bold">iFrame Playground</h1>
	<p class="mb-6">
		Change the counter in any of these origins to see the state being synced.
	</p>

	<Store {store} />

	<iframe
		class="mt-6 w-full h-[150px] border-0 overflow-hidden"
		src="https://localhost:3031/iframe/frame"
		title="iFrame #1"
		scrolling="no"
	></iframe>
	<iframe
		class="mt-6 w-full h-[150px] border-0 overflow-hidden"
		src="https://localhost:3032/iframe/frame"
		title="iFrame #2"
		scrolling="no"
	></iframe>
</div>
