import { type Writable } from "svelte/store";
import { createCrossOriginStore, type CoreOptions } from "./core.ts";

type PopupOptions<T> = CoreOptions<T> & {
	url: string;
	features?: string;
};

/**
 * Creates a writable Svelte store that synchronizes with popup windows.
 * Use this on the parent page that opens popups.
 * @param initialValue - The initial value for the store
 * @param options - Configuration options including the popup URL
 * @returns An object with the synced store and an `open` function to spawn popups
 * @example
 * ```ts
 * const { store, open } = createPopupStore(0, {
 * 	url: '/popup',
 * 	allowedOrigins: ['https://example.com'],
 * });
 * open();
 * ```
 */
export function createPopupStore<T>(
	initialValue: T,
	{ url, features, ...coreOptions }: PopupOptions<T>,
): { store: Writable<T>; open: () => Window | null } {
	const popups = new Set<Window>();

	const store = createCrossOriginStore(initialValue, coreOptions, () => {
		for (const popup of popups) {
			if (popup.closed) popups.delete(popup);
		}
		return Array.from(popups);
	});

	const open = () => {
		const popup = window.open(url, "_blank", features);
		if (popup) popups.add(popup);
		return popup;
	};

	return { store, open };
}

/**
 * Creates a writable Svelte store that synchronizes back to the opener window.
 * Use this on popup pages opened via `window.open()`.
 * @param initialValue - The initial value for the store
 * @param options - Configuration options
 * @returns A Writable store that syncs with the opener window
 * @example
 * ```ts
 * const store = createWritableStore(0, {
 * 	allowedOrigins: ['https://example.com'],
 * });
 * ```
 */
export function createWritableStore<T>(
	initialValue: T,
	options: CoreOptions<T> = {},
): Writable<T> {
	return createCrossOriginStore(initialValue, options, () => {
		return window.opener ? [window.opener] : [];
	});
}
