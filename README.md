# svelte-crossorigin-store

> Share your Svelte store across origins, including iFrames.

[![License](https://img.shields.io/github/license/idleberg/svelte-crossorigin-store?color=blue&style=for-the-badge)](https://github.com/idleberg/svelte-crossorigin-store/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/svelte-crossorigin-store?style=for-the-badge)](https://www.npmjs.org/package/svelte-crossorigin-store)
[![Build](https://img.shields.io/github/actions/workflow/status/idleberg/svelte-crossorigin-store/test.yml?style=for-the-badge)](https://github.com/idleberg/svelte-crossorigin-store/actions)

**Features**

- made for Svelte, works anywhere
- synchronizes store across multiple origins
- supports iFrames
- tiny (~450 bytes minified+gzipped)

## Installation

`npm install svelte-crossorigin-store`

## Usage

### Import

```ts
import { createStore } from 'svelte-crossorigin-store';

const store = createStore('Hello, world');
const unsubscribe = store.subscribe(value => console.log('State updated:', value));
```

Or, in your Svelte component:

```svelte
<script>
	import { createStore } from 'svelte-crossorigin-store';

	const store = createStore('Hello, world');
</script>

<p>Current State: {$store}</p>
```

:warning: Take note that all linked instances need to be initialized with the same value, otherwise an infinite loop will occur.

### API

#### `createStore`

```ts
createStore<T>(initialValue?: T, {
	allowedOrigins?: string[];
	id?: string;
	iframeSelector?: string;
	onChange?: (value: any) => void;
});
```

#### Methods

The created store exposes the same API methods like a writable `svelte/store`:

- `set()`
- `update()`
- `subscribe()`

Please refer to the [official documentation](https://svelte.dev/docs/svelte-store#writable).

## License

This work is licensed under [The MIT License](LICENSE).
