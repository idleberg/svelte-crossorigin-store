import { describe, it, expect, vi } from "vitest";
import { get } from "svelte/store";
import { createWritableStore } from "./window.ts";
import { sleep } from "./test-utils.ts";

describe("window (self-messaging)", () => {
	it("should create a store with initial value", () => {
		const store = createWritableStore(42);
		const unsub = store.subscribe(() => {});
		expect(get(store)).toBe(42);
		unsub();
	});

	it("should receive messages posted to window", async () => {
		const store = createWritableStore(0, {
			id: "test-window-receive",
			allowedOrigins: ["*"],
		});

		const unsub = store.subscribe(() => {});

		window.postMessage(
			{ id: "test-window-receive", type: "update", value: 77 },
			"*",
		);

		await sleep();

		expect(get(store)).toBe(77);

		unsub();
	});

	it("should ignore messages with wrong id", async () => {
		const store = createWritableStore(0, {
			id: "test-window-filter",
			allowedOrigins: ["*"],
		});

		const unsub = store.subscribe(() => {});

		window.postMessage({ id: "wrong-id", type: "update", value: 99 }, "*");

		await sleep();

		expect(get(store)).toBe(0);

		unsub();
	});

	it("should ignore malformed messages", async () => {
		const store = createWritableStore(0, {
			id: "test-window-malformed",
			allowedOrigins: ["*"],
		});

		const unsub = store.subscribe(() => {});

		window.postMessage("not an object", "*");
		window.postMessage({ unrelated: true }, "*");
		window.postMessage(null, "*");

		await sleep();

		expect(get(store)).toBe(0);

		unsub();
	});

	it("should broadcast local changes via postMessage", async () => {
		const messages: MessageEvent[] = [];
		const listener = (e: MessageEvent) => {
			if (e.data?.id === "test-window-broadcast") {
				messages.push(e);
			}
		};

		window.addEventListener("message", listener);

		const store = createWritableStore(0, {
			id: "test-window-broadcast",
			allowedOrigins: ["*"],
		});

		const unsub = store.subscribe(() => {});

		store.set(55);

		await sleep();

		const updates = messages.filter((m) => m.data.type === "update");
		expect(updates.length).toBe(1);
		expect(updates[0].data.value).toBe(55);

		window.removeEventListener("message", listener);
		unsub();
	});

	it("should respond to request messages with current value", async () => {
		const store = createWritableStore(42, {
			id: "test-window-handshake",
			allowedOrigins: ["*"],
		});

		const unsub = store.subscribe(() => {});

		const responses: MessageEvent[] = [];
		const listener = (e: MessageEvent) => {
			if (
				e.data?.id === "test-window-handshake" &&
				e.data.type === "response"
			) {
				responses.push(e);
			}
		};

		window.addEventListener("message", listener);

		window.postMessage({ id: "test-window-handshake", type: "request" }, "*");

		await sleep();

		expect(responses.length).toBeGreaterThanOrEqual(1);
		expect(responses[0].data.value).toBe(42);

		window.removeEventListener("message", listener);
		unsub();
	});

	it("should call onChange for local changes only", async () => {
		const onChange = vi.fn();
		const store = createWritableStore(0, {
			id: "test-window-onchange",
			allowedOrigins: ["*"],
			onChange,
		});

		const unsub = store.subscribe(() => {});

		store.set(10);
		expect(onChange).toHaveBeenCalledWith(10);

		onChange.mockClear();

		window.postMessage(
			{ id: "test-window-onchange", type: "update", value: 20 },
			"*",
		);

		await sleep();

		expect(get(store)).toBe(20);
		expect(onChange).not.toHaveBeenCalled();

		unsub();
	});

	it("should clean up listeners on unsubscribe", async () => {
		const store = createWritableStore(0, {
			id: "test-window-cleanup",
			allowedOrigins: ["*"],
		});

		const unsub = store.subscribe(() => {});
		unsub();

		window.postMessage(
			{ id: "test-window-cleanup", type: "update", value: 999 },
			"*",
		);

		await sleep();

		expect(get(store)).toBe(0);
	});
});
