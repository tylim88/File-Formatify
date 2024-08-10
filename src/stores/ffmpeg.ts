import { persistent } from './utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { FileWithPath } from '@mantine/dropzone'

const initialState = {
	isLoaded: false,
	message: null,
	items: [],
}
const ffmpeg = new FFmpeg()
export const useFFmpegStore = persistent<{
	load: () => void
	isLoaded: boolean
	message: null | string
	transcode: (index: number) => void
	items: ((
		| {
				outputURL: string
				status: 'done'
		  }
		| { status: 'loading' }
		| { status: 'idle' }
	) & { inputFile: FileWithPath })[]
}>(
	{
		name: 'alert',
		keysToPersist: [],
	},
	(set, get) => ({
		...initialState,
		load: async () => {
			const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
			ffmpeg.on('log', ({ message }) => {
				set({ message })
			})
			// toBlobURL is used to bypass CORS issue, urls with the same
			// domain can be used directly.
			ffmpeg
				.load({
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
				.then(() => {
					set({ isLoaded: true })
				})
				.catch(console.error)
		},
		reset: () => {
			set({ ...initialState, isLoaded: get().isLoaded })
		},
		transcode: async index => {
			const { items, isLoaded } = get()
			const item = get().items[index]
			if (!item) return
			while (!isLoaded) {
				await new Promise(res => {
					setTimeout(() => {
						res(null)
					}, 1000)
				}).catch(console.error)
			}
			items[index] = { ...item, status: 'loading' }
			const { name, path } = item.inputFile
			if (!path) return
			const outputPath = `${name}.mp4`
			await ffmpeg.exec(['-i', path, outputPath])
			const fileData = await ffmpeg.readFile(outputPath)
			const data = new Uint8Array(fileData as ArrayBuffer)
			items[index] = {
				...item,
				status: 'done',
				outputURL: URL.createObjectURL(
					new Blob([data.buffer], { type: 'video/mp4' })
				),
			}
			set({ items })
		},
	})
)
