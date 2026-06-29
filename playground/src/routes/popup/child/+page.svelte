<script lang="ts">
	import { createWritableStore } from "svengen/popup";
	import Store from "$lib/Store.svelte";

	const store = createWritableStore<number>(0, {
		allowedOrigins: ["*"],
	});
</script>

<svelte:head>
	<title>Popup (Child) | svengen</title>
</svelte:head>

<Store {store} label="Popup" />
