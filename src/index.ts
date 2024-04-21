import { writable, type Invalidator, type Subscriber } from 'svelte/store';

type Options = {
	id?: string;
	allowedOrigins?: string[];
	callback?: (value: any) => void;
};

export function createStore(initialValue: any, {
	allowedOrigins = ['*'],
	callback = undefined,
	id = 'svelte-crossorigin-store:message',
}: Options = {}) {
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
			const iframes = document.querySelectorAll('iframe');

			iframes.forEach(iframe => {
				_postMessageToManyOrigins(iframe?.contentWindow, value)
			});
		} else {
			_postMessageToManyOrigins(window.parent, value)
		}

		if (typeof callback === 'function') {
			callback(value);
		}
	});

	return {
		subscribe: _sharedSubscribe,
		set,
		update,
	};
}
