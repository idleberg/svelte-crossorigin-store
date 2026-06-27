<script lang="ts">
	import { Column, Grid, Row } from "carbon-components-svelte";
	import { createWritableStore } from "svelte-crossorigin-store/broadcast";
	import Store from "$lib/Store.svelte";

	const store = createWritableStore<number>(0);
</script>

<svelte:head>
	<title>Playground | Broadcast</title>
</svelte:head>

<Grid fullWidth>
	<Row>
		<Column padding>
			<h1>Broadcast Playground</h1>
			<p>
				Open this page in multiple tabs, then change the counter in one tab
				to see it sync across all tabs via <code>BroadcastChannel</code>.
			</p>
		</Column>
	</Row>

	<Row>
		<Column padding>
			<Store {store} label="Tab" />
		</Column>
	</Row>
</Grid>
