import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { qrcode } from 'vite-plugin-qrcode'
import mkcert from 'vite-plugin-mkcert'
import removeConsole from 'vite-plugin-remove-console'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tsconfigPaths from 'vite-tsconfig-paths'
import dynamicImport from 'vite-plugin-dynamic-import'
// @ts-expect-error ...
import vsharp from 'vite-plugin-vsharp'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		emptyOutDir: false,
	},
	plugins: [
		dynamicImport(),
		tsconfigPaths(),
		qrcode(),
		react(),
		svgr({ include: '**/*.svg' }),
		mkcert(),
		vsharp(),
		removeConsole({ includes: ['log'] }),
		viteStaticCopy({
			targets: [
				{
					src: '_redirects',
					dest: '',
				},
				{
					src: 'manifest.json',
					dest: '',
				},
				{
					src: 'icons',
					dest: '',
				},
				{
					src: 'audios',
					dest: '',
				},
				{
					src: 'characters',
					dest: '',
				},
			],
		}),
	],
})
