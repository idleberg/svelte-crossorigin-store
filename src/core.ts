import { type Invalidator, type Subscriber, type Writable, writable } from 'svelte/store';

export type CoreOptions<T> = {
	allowedOrigins?: string[];
	id?: string;
	onChange?: (value: T) => void;
};

type MessageType = 'update' | 'request' | 'response';

type MessageData<T> = {
	id: string;
	type: MessageType;
	sender?: string;
	value?: T;
};

/**
 * Creates a cross-origin synchronized writable Svelte store.
 * @param initialValue - The initial value for the store
 * @param options - Configuration options including allowed origins and change callback
 * @param getTargets - Returns the target windows to broadcast messages to
 * @returns A Writable store that syncs across contexts via postMessage
 */
export function createCrossOriginStore<T>(
	initialValue: T,
	{ allowedOrigins = ['*'], id = 'svelte-crossorigin-store:message', onChange = undefined }: CoreOptions<T>,
	getTargets: () => (Window | null)[],
): Writable<T> {
	const store = writable<T>(initialValue);
	const { subscribe, set, update } = store;
	const sender = crypto.randomUUID();

	let isApplyingRemoteChange = false;
	let initialized = false;
	let subscriberCount = 0;
	let unsubscribeInternal: (() => void) | undefined;
	let currentValue = initialValue;

	const postToTargets = (type: MessageType, value?: T) => {
		const targets = getTargets();

		for (const target of targets) {
			if (!target) continue;

			for (const origin of allowedOrigins) {
				try {
					target.postMessage({ id, type, sender, value } satisfies MessageData<T>, origin);
				} catch {
					// Target window may be closed
				}
			}
		}
	};

	const onMessage = (event: MessageEvent) => {
		if (!event.data || typeof event.data !== 'object' || !('id' in event.data) || !('type' in event.data)) {
			return;
		}

		if (!(allowedOrigins.includes(event.origin) || allowedOrigins.includes('*')) || event.data.id !== id) {
			return;
		}

		const { type, sender: messageSender, value } = event.data as MessageData<T>;

		if (messageSender === sender) {
			return;
		}

		if (type === 'request' && event.source) {
			for (const origin of allowedOrigins) {
				try {
					(event.source as Window).postMessage(
						{ id, type: 'response', sender, value: currentValue } satisfies MessageData<T>,
						origin,
					);
				} catch {
					// Source window may be closed
				}
			}
			return;
		}

		if (type === 'update' || type === 'response') {
			isApplyingRemoteChange = true;
			set(value as T);
			isApplyingRemoteChange = false;

			// Relay to other targets (e.g. parent forwarding between iframes)
			for (const target of getTargets()) {
				if (!target || target === event.source) continue;

				for (const origin of allowedOrigins) {
					try {
						target.postMessage({ id, type: 'update', sender: messageSender, value } satisfies MessageData<T>, origin);
					} catch {
						// Target window may be closed
					}
				}
			}
		}
	};

	const enhancedSubscribe = (run: Subscriber<T>, invalidate: Invalidator<T> = () => {}) => {
		subscriberCount++;

		if (subscriberCount === 1) {
			window.addEventListener('message', onMessage);

			unsubscribeInternal = store.subscribe((value) => {
				currentValue = value;

				if (!initialized) {
					initialized = true;
					return;
				}

				if (isApplyingRemoteChange) {
					return;
				}

				postToTargets('update', value);

				if (typeof onChange === 'function') {
					onChange(value);
				}
			});

			postToTargets('request');
		}

		const unsubscribe = subscribe(run, invalidate);

		return () => {
			subscriberCount--;
			unsubscribe();

			if (subscriberCount === 0) {
				window.removeEventListener('message', onMessage);

				if (unsubscribeInternal) {
					unsubscribeInternal();
					unsubscribeInternal = undefined;
					initialized = false;
				}
			}
		};
	};

	return {
		subscribe: enhancedSubscribe,
		set,
		update,
	};
}
