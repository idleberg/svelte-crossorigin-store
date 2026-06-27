<script>
import { Column, Grid, ListItem, Row, UnorderedList } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>Playground | svelte-crossorigin-store</title>
</svelte:head>

<Grid fullWidth>
	<Row>
		<Column padding>
			<h1>svelte-crossorigin-store</h1>
			<p>Select a playground:</p>
			<UnorderedList>
				<ListItem><a href="/iframe">iFrame</a></ListItem>
				<ListItem><a href="/window">Window</a></ListItem>
				<ListItem><a href="/broadcast">Broadcast</a></ListItem>
				<ListItem><a href="/popup">Popup</a></ListItem>
			</UnorderedList>
		</Column>
	</Row>
</Grid>
