<script lang="ts">
import { createWritableStore } from 'svelte-crossorigin-store/popup';
import Store from '$lib/Store.svelte';

const store = createWritableStore<number>(0, {
	allowedOrigins: ['*'],
});
</script>

<svelte:head>
	<title>Playground | Popup | Child</title>
</svelte:head>

<Store {store} label="Popup" />
