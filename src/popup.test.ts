import { get } from 'svelte/store';
import { describe, expect, it, vi } from 'vitest';
import { createPopupStore, createWritableStore } from './popup.ts';
import { sleep } from './test-utils.ts';

describe('popup', () => {
	describe('createPopupStore (parent side)', () => {
		it('should return a store and open function', () => {
			const { store, open } = createPopupStore(0, {
				url: '/popup',
				allowedOrigins: ['*'],
			});

			const unsub = store.subscribe(() => {});
			expect(get(store)).toBe(0);
			expect(typeof open).toBe('function');
			unsub();
		});

		it('should prune closed popups from targets', async () => {
			const { store, open } = createPopupStore(0, {
				url: '/popup',
				allowedOrigins: ['*'],
			});

			const unsub = store.subscribe(() => {});

			const fakePopup = { closed: false, postMessage: vi.fn() } as unknown as Window;
			vi.spyOn(window, 'open').mockReturnValue(fakePopup);

			open();

			store.set(1);
			await sleep();
			expect(fakePopup.postMessage).toHaveBeenCalled();

			(fakePopup as { closed: boolean }).closed = true;
			(fakePopup.postMessage as ReturnType<typeof vi.fn>).mockClear();

			store.set(2);
			await sleep();
			expect(fakePopup.postMessage).not.toHaveBeenCalled();

			vi.restoreAllMocks();
			unsub();
		});
	});

	describe('createWritableStore (popup child side)', () => {
		it('should create a store with initial value', () => {
			const store = createWritableStore(42);
			const unsub = store.subscribe(() => {});
			expect(get(store)).toBe(42);
			unsub();
		});

		it('should receive messages posted to window', async () => {
			const store = createWritableStore(0, {
				id: 'test-popup-receive',
				allowedOrigins: ['*'],
			});

			const unsub = store.subscribe(() => {});

			window.postMessage({ id: 'test-popup-receive', type: 'update', value: 77 }, '*');

			await sleep();

			expect(get(store)).toBe(77);

			unsub();
		});

		it('should clean up listeners on unsubscribe', async () => {
			const store = createWritableStore(0, {
				id: 'test-popup-cleanup',
				allowedOrigins: ['*'],
			});

			const unsub = store.subscribe(() => {});
			unsub();

			window.postMessage({ id: 'test-popup-cleanup', type: 'update', value: 999 }, '*');

			await sleep();

			expect(get(store)).toBe(0);
		});
	});
});
