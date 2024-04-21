# svelte-crossorigin-store

> Share your Svelte store across origins, including iFrames.

[![License](https://img.shields.io/github/license/idleberg/svelte-crossorigin-store?color=blue&style=for-the-badge)](https://github.com/idleberg/svelte-crossorigin-store/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/svelte-crossorigin-store?style=for-the-badge)](https://www.npmjs.org/package/svelte-crossorigin-store)
[![Build](https://img.shields.io/github/actions/workflow/status/idleberg/svelte-crossorigin-store/test.yml?style=for-the-badge)](https://github.com/idleberg/svelte-crossorigin-store/actions)

**Features**

- synchronizes store across multiple origins
- supports iFrames
- tiny (~720 bytes minified, before gzip)

## Installation

`npm install svelte-crossorigin-store`

## Usage

### Import

```svelte
<script>
	import { createStore } from 'svelte-crossorigin-store';

	const store = createStore('Hello, world');
</script>

<p>Current state: {$store}</p>
```

### API

#### `createStore`

```ts
// Default values for example use
createStore({
	allowedOrigins = ['*'],
	id = 'svelte-crossorigin-store:message',
	iframeSelector = 'iframe',
	onChange = undefined,
});
```

#### Methods

The created store exposes the same API methods like a writable `svelte/store`:

- `set()`
- `update()`
- `subscribe()`

Please refer to the [official documentation](https://svelte.dev/docs/svelte-store#writable).

## License

This work is licensed under [The MIT License](LICENSE)

[dot notation]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors#Dot_notation
[storage api]: https://developer.mozilla.org/en-US/docs/Web/API/Storage
[indexeddb api]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
