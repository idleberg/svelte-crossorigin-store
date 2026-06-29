<script lang="ts">
	import { page } from "$app/state";
	import ThemeToggle from "./ThemeToggle.svelte";

	const labels: Record<string, string> = {
		iframe: "iFrame",
		broadcast: "Broadcast",
		window: "Window",
		popup: "Popup",
	};

	let crumbs = $derived.by(() => {
		const segments = page.url.pathname.split("/").filter(Boolean);
		return segments.map((seg, i) => ({
			label: labels[seg] ?? seg,
			href: `/${segments.slice(0, i + 1).join("/")}`,
		}));
	});
</script>

<nav aria-label="Breadcrumb" class="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
		<ol class="flex items-center gap-1.5 text-sm">
			<li>
				<a
					class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					href="/">Home</a
				>
			</li>
			{#each crumbs as crumb, i}
				<li aria-hidden="true" class="text-gray-400 dark:text-gray-500">/</li>
				<li>
					{#if i === crumbs.length - 1}
						<span aria-current="page" class="font-medium text-gray-900 dark:text-gray-100"
							>{crumb.label}</span
						>
					{:else}
						<a
							class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
							href={crumb.href}>{crumb.label}</a
						>
					{/if}
				</li>
			{/each}
		</ol>
		<ThemeToggle />
	</div>
</nav>
