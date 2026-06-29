# svelte-crossorigin-store

> Share your Svelte store across origins, including iFrames.

[![License](https://img.shields.io/github/license/idleberg/svelte-crossorigin-store?color=blue&style=for-the-badge)](https://github.com/idleberg/svelte-crossorigin-store/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/svelte-crossorigin-store?style=for-the-badge)](https://www.npmjs.org/package/svelte-crossorigin-store)
[![Build](https://img.shields.io/github/actions/workflow/status/idleberg/svelte-crossorigin-store/test.yml?style=for-the-badge)](https://github.com/idleberg/svelte-crossorigin-store/actions)

> [!IMPORTANT]
> Since the scope of this package has changed beyond cross-origin, future version of this package will be published under the new name [svengen](https://www.npmjs.org/package/svengen).

**Features**

- made for Svelte, works anywhere
- synchronizes store across multiple origins
- supports iFrames, popup windows, same-page scripts, and cross-tab sync
- automatic initial state handshake
- tiny (~450 bytes minified+gzipped per entrypoint)

## Installation

`npm install svelte-crossorigin-store`

## Usage

The library provides four entrypoints, each targeting a different communication mechanism:

| Entrypoint                           | Use Case                                           | API                |
| ------------------------------------ | -------------------------------------------------- | ------------------ |
| `svelte-crossorigin-store/iframe`    | Parent page ↔ iFrames (cross-origin)               | `postMessage`      |
| `svelte-crossorigin-store/popup`     | Parent page ↔ popup windows                        | `postMessage`      |
| `svelte-crossorigin-store/window`    | Same-page scripts (e.g. first-party ↔ third-party) | `postMessage`      |
| `svelte-crossorigin-store/broadcast` | Same-origin tabs                                   | `BroadcastChannel` |

The iframe, window, and broadcast entrypoints export `createWritableStore`, which returns a standard Svelte `Writable` store. The popup entrypoint exports both `createPopupStore` (for the parent) and `createWritableStore` (for the popup child).

### iFrame

Synchronizes state between a parent page and its iFrames. The parent automatically relays updates between sibling iFrames.

```svelte
<script>
  import { createWritableStore } from 'svelte-crossorigin-store/iframe';

  const counter = createWritableStore(0, {
    allowedOrigins: ['https://example.com'],
  });
</script>

<p>Current Value: {$counter}</p>
```

#### Options

```ts
createWritableStore<T>(initialValue: T, {
  allowedOrigins?: string[];   // Origins to accept messages from (default: ['*'])
  id?: string;                 // Message channel identifier (default: 'svelte-crossorigin-store:message')
  iframeSelector?: string;     // CSS selector for target iFrames (default: 'iframe')
  onChange?: (value: T) => void;
});
```

### Popup

Synchronizes state between a parent page and popup windows opened via `window.open()`. The parent uses `createPopupStore`, which returns a `store` and an `open` function. Popups use `createWritableStore` and automatically sync back via `window.opener`.

**Parent page:**

```svelte
<script>
  import { createPopupStore } from 'svelte-crossorigin-store/popup';

  const { store, open } = createPopupStore(0, {
    url: '/popup-page',
    allowedOrigins: ['https://example.com'],
  });
</script>

<button on:click={() => open()}>Open Popup</button>
<p>Current Value: {$store}</p>
```

**Popup page:**

```ts
import { createWritableStore } from "svelte-crossorigin-store/popup";

const store = createWritableStore(0, {
	allowedOrigins: ["https://example.com"],
});
```

#### Options

`createPopupStore`:

```ts
createPopupStore<T>(initialValue: T, {
  url: string;                 // URL to open in the popup (required)
  features?: string;           // window.open() features string (e.g. 'width=400,height=300')
  allowedOrigins?: string[];   // Origins to accept messages from (default: ['*'])
  id?: string;                 // Message channel identifier (default: 'svelte-crossorigin-store:message')
  onChange?: (value: T) => void;
});
// Returns: { store: Writable<T>, open: () => Window | null }
```

`createWritableStore` (popup child) accepts the same options as the [Window](#window) entrypoint.

### Window

Synchronizes state between scripts on the same page via `postMessage` to `window`. Useful for communicating between a first-party Svelte app and third-party scripts.

```ts
import { createWritableStore } from "svelte-crossorigin-store/window";

const store = createWritableStore(0, {
	allowedOrigins: ["https://example.com"],
});
```

#### Options

```ts
createWritableStore<T>(initialValue: T, {
  allowedOrigins?: string[];   // Origins to accept messages from (default: ['*'])
  id?: string;                 // Message channel identifier (default: 'svelte-crossorigin-store:message')
  onChange?: (value: T) => void;
});
```

### Broadcast

Synchronizes state across browser tabs on the same origin using the `BroadcastChannel` API.

```ts
import { createWritableStore } from "svelte-crossorigin-store/broadcast";

const store = createWritableStore(0, {
	channelName: "my-counter",
});
```

#### Options

```ts
createWritableStore<T>(initialValue: T, {
  channelName?: string;        // BroadcastChannel name (default: 'svelte-crossorigin-store')
  onChange?: (value: T) => void;
});
```

### Methods

All stores expose the standard Svelte writable store API:

- `set(value)`
- `update(updater)`
- `subscribe(subscriber)`

Refer to the [official documentation](https://svelte.dev/docs/svelte-store#writable) for details.

## Playground

This repository contains a playground application of a classic counter that synchronizes its state across three origins: the parent page and two iFrames running on different ports.

To launch the application, run the following:

```sh
pnpm start
```

This should automatically open `https://localhost:3030` in your default browser.

## License

This work is licensed under [The MIT License](LICENSE).
