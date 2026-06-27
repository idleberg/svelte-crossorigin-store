<script lang="ts">
	import { Button, Column, Grid, Row } from "carbon-components-svelte";
	import { createPopupStore } from "svelte-crossorigin-store/popup";
	import Store from "$lib/Store.svelte";

	const { store, open } = createPopupStore<number>(0, {
		url: "/popup/child",
		allowedOrigins: ["*"],
	});
</script>

<svelte:head>
	<title>Playground | Popup</title>
</svelte:head>

<Grid fullWidth>
	<Row>
		<Column padding>
			<h1>Popup Playground</h1>
			<p>
				Click "Open Popup" to spawn a popup window, then change the counter
				in either window to see the state sync via <code>postMessage</code>.
			</p>
		</Column>
	</Row>

	<Row>
		<Column padding>
			<Store {store} label="Parent" />
		</Column>
	</Row>

	<Row>
		<Column padding>
			<Button on:click={() => open()}>Open Popup</Button>
		</Column>
	</Row>
</Grid>
