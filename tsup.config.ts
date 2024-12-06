import { defineConfig } from 'tsup';

export default defineConfig((options) => {
	return {
		target: 'esnext',
		clean: true,
		dts: !options.watch,
		entry: [
			'src/iframe.ts',
			'src/window.ts',
		],
		format: 'esm',
		minify: !options.watch,
		treeshake: 'recommended'
	}
});
