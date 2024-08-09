import { persistent } from './utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'

const initialState = {
	isLoaded: false,
	message: null,
	results: [],
}
const ffmpeg = new FFmpeg()
export const useAlertStore = persistent<{
	load: () => void
	isLoaded: boolean
	message: null | string
	transcode: (index: number) => void
	results: ((
		| {
				newUrl: string
				status: 'done'
		  }
		| { status: 'loading' }
		| { status: 'idle' }
	) & { url: string })[]
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
			const { results, isLoaded } = get()
			const result = get().results[index]
			if (!result) return
			while (!isLoaded) {
				await new Promise(res => {
					setTimeout(() => {
						res(null)
					}, 1000)
				}).catch(console.error)
			}
			results[index] = { ...result, status: 'loading' }
			const videoURL = result.url
			const inputPath = `input_${index}.avi`
			const outputPath = `output_${index}.mp4`
			await ffmpeg.writeFile(inputPath, await fetchFile(videoURL))
			await ffmpeg.exec(['-i', inputPath, outputPath])
			const fileData = await ffmpeg.readFile(outputPath)
			const data = new Uint8Array(fileData as ArrayBuffer)
			results[index] = {
				...result,
				status: 'done',
				newUrl: URL.createObjectURL(
					new Blob([data.buffer], { type: 'video/mp4' })
				),
			}
			set({ results })
		},
	})
)
