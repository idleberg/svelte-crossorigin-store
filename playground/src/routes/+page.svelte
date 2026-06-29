<script>
	import ThemeToggle from "$lib/ThemeToggle.svelte";
</script>

<svelte:head>
	<title>Playground | svengen</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">svengen</h1>
		<ThemeToggle />
	</div>
	<p class="mb-2">Select a playground:</p>
	<ul class="list-disc pl-6">
		<li>
			<a class="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" href="/iframe"
				>iFrame</a
			>
		</li>
		<li>
			<a class="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" href="/window"
				>Window</a
			>
		</li>
		<li>
			<a
				class="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
				href="/broadcast">Broadcast</a
			>
		</li>
		<li>
			<a class="text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" href="/popup"
				>Popup</a
			>
		</li>
	</ul>
</div>
