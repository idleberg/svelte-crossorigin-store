<script lang="ts">
	import { onMount } from "svelte";
	import { createWritableStore } from "svengen/window";

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
	<title>Window | svengen</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-4 text-2xl font-bold">Window Playground</h1>
	<p class="mb-2">
		Type a message and click Send. A third-party script on this page listens for <code
			class="rounded bg-gray-100 px-1 dark:bg-gray-800">postMessage</code
		> events and shows an alert with the value.
	</p>
	<p class="mb-6">Store value: <strong>{$store || "(empty)"}</strong></p>

	<div class="flex gap-2">
		<label class="sr-only" for="message-input">Message</label>
		<input
			id="message-input"
			class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus-visible:border-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
			type="text"
			placeholder="Type a message…"
			bind:value={text}
		/>
		<button
			class="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
			onclick={send}>Send</button
		>
	</div>
</div>
