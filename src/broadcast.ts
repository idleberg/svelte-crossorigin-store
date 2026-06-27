import { type Invalidator, type Subscriber, type Writable, writable } from 'svelte/store';

type MessageType = 'update' | 'request' | 'response';

type BroadcastMessage<T> = {
	type: MessageType;
	value?: T;
};

type BroadcastOptions<T> = {
	channelName?: string;
	onChange?: (value: T) => void;
};

/**
 * Creates a writable Svelte store that synchronizes across tabs using BroadcastChannel.
 * Works only for same-origin tabs (no cross-origin support).
 * @param initialValue - The initial value for the store
 * @param options - Configuration options
 * @returns A Writable store that syncs across browser tabs
 * @example
 * ```ts
 * const store = createWritableStore(0, {
 * 	channelName: 'my-counter',
 * 	onChange: (value) => console.log('Changed:', value),
 * });
 * ```
 */
export function createWritableStore<T>(
	initialValue: T,
	{ channelName = 'svelte-crossorigin-store', onChange = undefined }: BroadcastOptions<T> = {},
): Writable<T> {
	const store = writable<T>(initialValue);
	const { subscribe, set, update } = store;

	let isApplyingRemoteChange = false;
	let initialized = false;
	let subscriberCount = 0;
	let unsubscribeInternal: (() => void) | undefined;

	const channel = new BroadcastChannel(channelName);

	let currentValue = initialValue;

	const onMessage = (event: MessageEvent<BroadcastMessage<T>>) => {
		const { type, value } = event.data;

		if (type === 'request') {
			channel.postMessage({ type: 'response', value: currentValue } satisfies BroadcastMessage<T>);
			return;
		}

		if (type === 'update' || type === 'response') {
			isApplyingRemoteChange = true;
			set(value as T);
			isApplyingRemoteChange = false;
		}
	};

	const enhancedSubscribe = (run: Subscriber<T>, invalidate: Invalidator<T> = () => {}) => {
		subscriberCount++;

		if (subscriberCount === 1) {
			channel.addEventListener('message', onMessage);

			unsubscribeInternal = store.subscribe((value) => {
				currentValue = value;

				if (!initialized) {
					initialized = true;
					return;
				}

				if (isApplyingRemoteChange) {
					return;
				}

				channel.postMessage({ type: 'update', value } satisfies BroadcastMessage<T>);

				if (typeof onChange === 'function') {
					onChange(value);
				}
			});

			channel.postMessage({ type: 'request' } satisfies BroadcastMessage<T>);
		}

		const unsubscribe = subscribe(run, invalidate);

		return () => {
			subscriberCount--;
			unsubscribe();

			if (subscriberCount === 0) {
				channel.removeEventListener('message', onMessage);

				if (unsubscribeInternal) {
					unsubscribeInternal();
					unsubscribeInternal = undefined;
					initialized = false;
				}
				channel.close();
			}
		};
	};

	return {
		subscribe: enhancedSubscribe,
		set,
		update,
	};
}
