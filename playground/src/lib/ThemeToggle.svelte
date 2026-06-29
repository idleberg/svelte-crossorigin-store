<script lang="ts">
	type Theme = "system" | "light" | "dark";

	let theme = $state<Theme>("system");

	function applyTheme(t: Theme) {
		const isDark =
			t === "dark" ||
			(t === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		document.documentElement.classList.toggle("dark", isDark);
	}

	function setTheme(t: Theme) {
		theme = t;
		localStorage.setItem("theme", t);
		applyTheme(t);
	}

	$effect(() => {
		const stored = localStorage.getItem("theme") as Theme | null;
		if (stored && ["system", "light", "dark"].includes(stored)) {
			theme = stored;
		}
		applyTheme(theme);

		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (theme === "system") applyTheme("system");
		};
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	});
</script>

<div
	class="flex rounded-lg border border-gray-200 dark:border-gray-700"
	role="radiogroup"
	aria-label="Theme"
>
	<button
		class="cursor-pointer rounded-l-lg px-2 py-1.5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 {theme ===
		'system'
			? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
			: 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}"
		onclick={() => setTheme("system")}
		aria-checked={theme === "system"}
		aria-label="System theme"
		role="radio"
	>
		<svg
			aria-hidden="true"
			class="size-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z"
			/>
		</svg>
	</button>
	<button
		class="cursor-pointer border-x border-gray-200 px-2 py-1.5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-gray-700 {theme ===
		'light'
			? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
			: 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}"
		onclick={() => setTheme("light")}
		aria-checked={theme === "light"}
		aria-label="Light theme"
		role="radio"
	>
		<svg
			aria-hidden="true"
			class="size-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
			/>
		</svg>
	</button>
	<button
		class="cursor-pointer rounded-r-lg px-2 py-1.5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 {theme ===
		'dark'
			? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
			: 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}"
		onclick={() => setTheme("dark")}
		aria-checked={theme === "dark"}
		aria-label="Dark theme"
		role="radio"
	>
		<svg
			aria-hidden="true"
			class="size-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
			/>
		</svg>
	</button>
</div>
