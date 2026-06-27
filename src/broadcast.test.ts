import { describe, it, expect, vi } from "vitest";
import { get } from "svelte/store";
import { createWritableStore } from "./broadcast.ts";
import { sleep } from "./test-utils.ts";

describe("broadcast", () => {
	it("should create a store with initial value", () => {
		const store = createWritableStore(42);
		const unsub = store.subscribe(() => {});
		expect(get(store)).toBe(42);
		unsub();
	});

	it("should sync values between two stores on the same channel", async () => {
		const store1 = createWritableStore(0, { channelName: "test-sync" });
		const store2 = createWritableStore(0, { channelName: "test-sync" });

		const unsub1 = store1.subscribe(() => {});
		const unsub2 = store2.subscribe(() => {});

		store1.set(99);

		await sleep();

		expect(get(store2)).toBe(99);

		unsub1();
		unsub2();
	});

	it("should not sync between different channel names", async () => {
		const store1 = createWritableStore(0, { channelName: "channel-a" });
		const store2 = createWritableStore(0, { channelName: "channel-b" });

		const unsub1 = store1.subscribe(() => {});
		const unsub2 = store2.subscribe(() => {});

		store1.set(123);

		await sleep();

		expect(get(store2)).toBe(0);

		unsub1();
		unsub2();
	});

	it("should prevent infinite loops", async () => {
		const store1 = createWritableStore(0, { channelName: "test-loop" });
		const store2 = createWritableStore(0, { channelName: "test-loop" });

		const values: number[] = [];
		const unsub1 = store1.subscribe(() => {});
		const unsub2 = store2.subscribe((v) => values.push(v));

		store1.set(1);

		await sleep(100);

		expect(values.filter((v) => v === 1).length).toBe(1);

		unsub1();
		unsub2();
	});

	it("should call onChange for local changes only", async () => {
		const onChange = vi.fn();
		const store1 = createWritableStore<number>(0, {
			channelName: "test-onchange",
			onChange,
		});
		const store2 = createWritableStore(0, { channelName: "test-onchange" });

		const unsub1 = store1.subscribe(() => {});
		const unsub2 = store2.subscribe(() => {});

		store1.set(5);

		await sleep();

		expect(onChange).toHaveBeenCalledWith(5);

		onChange.mockClear();

		store2.set(10);

		await sleep();

		expect(onChange).not.toHaveBeenCalled();

		unsub1();
		unsub2();
	});

	it("should handle request/response handshake for late joiners", async () => {
		const store1 = createWritableStore(0, { channelName: "test-handshake" });
		const unsub1 = store1.subscribe(() => {});

		store1.set(42);

		await sleep();

		const store2 = createWritableStore(0, { channelName: "test-handshake" });
		const unsub2 = store2.subscribe(() => {});

		await sleep();

		expect(get(store2)).toBe(42);

		unsub1();
		unsub2();
	});

	it("should clean up on unsubscribe", () => {
		const store = createWritableStore(0, { channelName: "test-cleanup" });
		const unsub = store.subscribe(() => {});

		unsub();
	});
});
