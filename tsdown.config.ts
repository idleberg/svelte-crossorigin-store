import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	return {
		target: 'esnext',
		clean: true,
		dts: !options.watch,
		entry: ['src/iframe.ts', 'src/window.ts', 'src/broadcast.ts', 'src/popup.ts'],
		format: 'esm',
		minify: !options.watch,
	};
});
