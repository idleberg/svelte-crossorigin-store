<script lang="ts">
	import type { Writable } from "svelte/store";

	let { store, label }: { store: Writable<number>; label?: string } = $props();

	const clickHandler = (value: null | number = 0) => {
		store.update((counter) => (value === null ? 0 : counter + value));
	};
</script>

<section class="h-[150px]">
	<h2 class="my-4 flex items-center gap-2 text-lg font-semibold">
		{label ?? (window.self === window.top ? "Parent" : "iFrame")}
		<span class="rounded border px-2 py-0.5 text-xs"
			>{window.location.host}</span
		>
		<span class="rounded bg-gray-800 px-2 py-0.5 text-xs text-white"
			>Current Value: {$store}</span
		>
	</h2>

	<div class="flex gap-2">
		<button
			class="rounded bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
			onclick={() => clickHandler(1)}>+ Add</button
		>
		<button
			class="rounded bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
			onclick={() => clickHandler(-1)}>- Subtract</button
		>
		<button
			class="rounded border border-blue-600 px-4 py-2 text-sm text-violet-600 hover:bg-violet-50"
			onclick={() => clickHandler(null)}>Reset</button
		>
	</div>
</section>
