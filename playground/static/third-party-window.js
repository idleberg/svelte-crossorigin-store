window.addEventListener('message', (event) => {
	if (
		event.data &&
		event.data.id === 'svelte-crossorigin-store:message' &&
		event.data.type === 'update' &&
		typeof event.data.value === 'string'
	) {
		alert(event.data.value);
	}
});
