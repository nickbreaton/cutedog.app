import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { dependencies } from './package.json';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: [...Object.keys(dependencies)]
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
