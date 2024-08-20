import { persistent } from './utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { isChromium } from '@/utils'

const initialState = {
	packageStatus: 'idle' as const,
	message: null,
}
export const ffmpeg = new FFmpeg()
export const useFFmpegStore = persistent<{
	load: () => void
	packageStatus: 'idle' | 'loading' | 'loaded'
	message: null | string
}>(
	{
		name: 'ffmpegVideo',
		keysToPersist: [],
	},
	(set, get) => {
		return {
			...initialState,
			reset: () => {
				set({ ...initialState, packageStatus: get().packageStatus })
			},
			load: async () => {
				const { packageStatus: status } = get()
				if (status !== 'idle') return
				set({ packageStatus: 'loading' })
				const baseURL = isChromium()
					? 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
					: 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
				ffmpeg.on('log', ({ message }) => {
					console.log({ message })
					set({ message })
				})
				// toBlobURL is used to bypass CORS issue, urls with the same
				// domain can be used directly.
				try {
					await ffmpeg.load({
						coreURL: await toBlobURL(
							`${baseURL}/ffmpeg-core.js`,
							'text/javascript'
						),
						wasmURL: await toBlobURL(
							`${baseURL}/ffmpeg-core.wasm`,
							'application/wasm'
						),
						workerURL: await toBlobURL(
							`${baseURL}/ffmpeg-core.worker.js`,
							'text/javascript'
						),
					})
					set({ packageStatus: 'loaded' })
				} catch (e) {
					set({ packageStatus: 'idle' })
					console.error(e)
				}
			},
		}
	}
)
