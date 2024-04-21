import { writable, type Invalidator, type Subscriber, type Writable } from 'svelte/store';

type Options = {
	allowedOrigins?: string[];
	id?: string;
	iframeSelector?: string;
	onChanged?: (value: any) => void;
};
/**
 * Creates a writable Svelte store.
 * @param {any} initialValue
 * @param {Options} options
 * @returns {Writable<any>}
 * @example
 * ```ts
 * createStore({
 * 	allowedOrigins = ['*'],
 * 	id = 'svelte-crossorigin-store:message',
 * 	iframeSelector = 'iframe',
 * 	onChanged = undefined,
 * });
 *```
 */
export function createStore(initialValue: any, {
	allowedOrigins = ['*'],
	id = 'svelte-crossorigin-store:message',
	iframeSelector = 'iframe',
	onChanged = undefined,
}: Options = {}): Writable<any> {
	const store = writable(initialValue);
	const { subscribe, set, update } = store;

	const onMessage = (event: MessageEvent) => {
		if ((allowedOrigins.includes(event.origin) || allowedOrigins.includes('*')) && event.data.id === id) {
			set(event.data.value);
		}
	};

	const _sharedSubscribe = (run: Subscriber<any>, invalidate: Invalidator<any> = () => { }) => {
		const unsubscribe = subscribe(run, invalidate);

		window.addEventListener('message', onMessage);

		return () => {
			window.removeEventListener('message', onMessage);

			unsubscribe();
		};
	};

	const _postMessageToManyOrigins = (target: HTMLIFrameElement['contentWindow'] | Window, value: any) => {
		allowedOrigins.forEach(origin => {
			target?.postMessage({ id, value }, origin);
		});
	}

	store.subscribe(value => {
		_postMessageToManyOrigins(window, value);

		if (window.self === window.top) {
			const iframes = document.querySelectorAll(iframeSelector);

			iframes.forEach(iframe => {
				_postMessageToManyOrigins(iframe?.contentWindow, value)
			});
		} else {
			_postMessageToManyOrigins(window.parent, value)
		}

		if (typeof onChanged === 'function') {
			onChanged(value);
		}
	});

	return {
		subscribe: _sharedSubscribe,
		set,
		update,
	};
}
