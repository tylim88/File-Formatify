import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { qrcode } from 'vite-plugin-qrcode'
import mkcert from 'vite-plugin-mkcert'
import removeConsole from 'vite-plugin-remove-console'
import tsconfigPaths from 'vite-tsconfig-paths'
import dynamicImport from 'vite-plugin-dynamic-import'
import vsharp from 'vite-plugin-vsharp'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		emptyOutDir: true,
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
	],
	optimizeDeps: {
		exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
	},
	server: {
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
		},
	},
})
