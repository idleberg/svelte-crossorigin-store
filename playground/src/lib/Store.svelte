<script lang="ts">
import { Button, ButtonSet, Tag } from 'carbon-components-svelte';
import Add from 'carbon-icons-svelte/lib/Add.svelte';
import Reset from 'carbon-icons-svelte/lib/Reset.svelte';
import Subtract from 'carbon-icons-svelte/lib/Subtract.svelte';
import type { Writable } from 'svelte/store';

let { store, label }: { store: Writable<number>; label?: string } = $props();

const clickHandler = (value: null | number = 0) => {
	store.update((counter) => (value === null ? 0 : counter + value));
};
</script>

<section>
	<h2>
		{label ?? (window.self === window.top ? "Parent" : "iFrame")}
		<Tag type="outline">{window.location.host}</Tag>
		<Tag type="high-contrast">Current Value: {$store}</Tag>
	</h2>

	<ButtonSet>
		<Button icon={Add} on:click={() => clickHandler(1)}>Add</Button>
		<Button icon={Subtract} on:click={() => clickHandler(-1)}>Subtract</Button>
		<Button icon={Reset} kind="secondary" on:click={() => clickHandler(null)}>reset</Button>
	</ButtonSet>
</section>

<style>
	h2 {
		margin: 1rem 0;
	}

	section {
		height: 150px;
	}
</style>
