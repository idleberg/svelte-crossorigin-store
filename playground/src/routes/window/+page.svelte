<script lang="ts">
	import { Column, Grid, Row, TextInput, Button } from "carbon-components-svelte";
	import { createWritableStore } from "svelte-crossorigin-store/window";
	import { onMount } from "svelte";

	const store = createWritableStore<string>("");

	let text = $state("");

	const send = () => {
		store.set(text);
	};

	onMount(() => {
		const script = document.createElement("script");
		script.src = "/third-party-window.js";
		document.body.appendChild(script);
		return () => script.remove();
	});
</script>

<svelte:head>
	<title>Playground | Window</title>
</svelte:head>

<Grid fullWidth>
	<Row>
		<Column padding>
			<h1>Window Playground</h1>
			<p>
				Type a message and click Send. A third-party script on this page
				listens for <code>postMessage</code> events and shows an alert with the value.
			</p>
			<p>Store value: <strong>{$store || "(empty)"}</strong></p>
		</Column>
	</Row>

	<Row>
		<Column padding>
			<TextInput
				labelText="Message"
				placeholder="Type a message…"
				bind:value={text}
			/>
		</Column>
	</Row>

	<Row>
		<Column padding>
			<Button on:click={send}>Send</Button>
		</Column>
	</Row>
</Grid>
