import { type Writable } from "svelte/store";
import { createCrossOriginStore, type CoreOptions } from "./core.ts";

type IframeOptions<T> = CoreOptions<T> & {
	iframeSelector?: string;
};

/**
 * Creates a writable Svelte store that synchronizes across iframe boundaries.
 * Works bidirectionally: parent can sync with iframes, iframes can sync with parent.
 * @param initialValue - The initial value for the store
 * @param options - Configuration options
 * @returns A Writable store that syncs across iframes
 * @example
 * ```ts
 * const store = createWritableStore(0, {
 * 	allowedOrigins: ['https://example.com'],
 * 	iframeSelector: 'iframe.synced',
 * 	onChange: (value) => console.log('Changed:', value),
 * });
 * ```
 */
export function createWritableStore<T>(
	initialValue: T,
	{ iframeSelector = "iframe", ...coreOptions }: IframeOptions<T> = {},
): Writable<T> {
	return createCrossOriginStore(initialValue, coreOptions, () => {
		if (window.self === window.top) {
			const iframes = document.querySelectorAll(
				iframeSelector,
			) as NodeListOf<HTMLIFrameElement>;
			return Array.from(iframes, (iframe) => iframe.contentWindow);
		}

		return [window.parent];
	});
}
