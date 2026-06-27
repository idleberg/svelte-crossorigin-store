import type { Writable } from 'svelte/store';
import { type CoreOptions, createCrossOriginStore } from './core';

/**
 * Creates a writable Svelte store that synchronizes with third-party scripts on the same page.
 * Uses postMessage to window (self-messaging) with origin filtering for security.
 * @param initialValue - The initial value for the store
 * @param options - Configuration options
 * @returns A Writable store that syncs via postMessage on the same window
 * @example
 * ```ts
 * const store = createWritableStore(0, {
 * 	allowedOrigins: ['https://example.com'],
 * 	onChange: (value) => console.log('Changed:', value),
 * });
 * ```
 */
export function createWritableStore<T>(initialValue: T, options: CoreOptions<T> = {}): Writable<T> {
	return createCrossOriginStore(initialValue, options, () => [window]);
}
