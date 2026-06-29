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
	<title>Playground | iFrame | {window.location.origin}</title>
</svelte:head>

<Store {store} />
