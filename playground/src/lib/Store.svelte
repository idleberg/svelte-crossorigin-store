<script lang="ts">
	import type { Writable } from "svelte/store";

	let { store, label }: { store: Writable<number>; label?: string } = $props();

	const clickHandler = (value: null | number = 0) => {
		store.update((counter) => (value === null ? 0 : counter + value));
	};
</script>

<section class="h-[150px]" aria-label="{label ?? (window.self === window.top ? 'Parent' : 'iFrame')} store controls">
	<h2 class="my-4 flex items-center gap-2 text-lg font-semibold">
		{label ?? (window.self === window.top ? "Parent" : "iFrame")}
		<span class="rounded border border-gray-300 px-2 py-0.5 text-xs dark:border-gray-600"
			>{window.location.host}</span
		>
		<span class="rounded bg-gray-800 px-2 py-0.5 text-xs text-white dark:bg-gray-700"
			>Current Value: <output>{$store}</output></span
		>
	</h2>

	<div class="flex gap-2" role="group" aria-label="Counter controls">
		<button
			class="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
			onclick={() => clickHandler(1)}>+ Add</button
		>
		<button
			class="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
			onclick={() => clickHandler(-1)}>- Subtract</button
		>
		<button
			class="rounded border border-indigo-600 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950"
			onclick={() => clickHandler(null)}>Reset</button
		>
	</div>
</section>
