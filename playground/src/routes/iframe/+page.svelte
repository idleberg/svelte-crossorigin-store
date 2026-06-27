<script lang="ts">
	import { Column, Grid, Row } from "carbon-components-svelte";
	import { createWritableStore } from "svelte-crossorigin-store/iframe";
	import Store from "$lib/Store.svelte";

	const store = createWritableStore<number>(1, {
		onChange: (value) => {
			localStorage.setItem("counter", String(value));
		},
	});
</script>

<svelte:head>
	<title>Playground | iFrame</title>
</svelte:head>

<Grid fullWidth>
	<Row>
		<Column padding>
			<h1>iFrame Playground</h1>
			<p>Change the counter in any of these origins to see the state being synced.</p>
		</Column>
	</Row>

	<Row>
		<Column padding>
			<Store {store} />
		</Column>
	</Row>

	<Row>
		<Column padding>
			<iframe src="https://localhost:3031/iframe/frame" title="iFrame #1"></iframe>
		</Column>
	</Row>

	<Row>
		<Column padding>
			<iframe src="https://localhost:3032/iframe/frame" title="iFrame #2"></iframe>
		</Column>
	</Row>
</Grid>

<style>
	iframe {
		width: 100%;
		height: 150px;
		border: 0;
	}
</style>
