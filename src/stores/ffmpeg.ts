import { persistent } from './utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'
import { FileWithPath } from '@mantine/dropzone'

const initialState = {
	isLoading: false,
	status: 'idle' as const,
	message: null,
	items: [],
}
const ffmpeg = new FFmpeg()
export const useFFmpegStore = persistent<{
	load: () => void
	status: 'idle' | 'loading' | 'loaded'
	message: null | string
	transcode: (props: { index: number; ext: string | undefined }) => void
	items: ((
		| { outputPath: string; outputURL: string; status: 'done' }
		| { status: 'loading' | 'idle' }
	) & { inputFile: FileWithPath })[]
}>(
	{
		name: 'ffmpeg',
		keysToPersist: [],
	},
	(set, get) => ({
		...initialState,
		load: async () => {
			const { status } = get()
			if (status !== 'idle') return
			set({ status: 'loading' })
			const baseURL = isChromium()
				? 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
				: 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
			ffmpeg.on('log', ({ message }) => {
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
				set({ status: 'loaded' })
			} catch (e) {
				set({ status: 'idle' })
				console.error(e)
			}
		},
		reset: () => {
			set({ ...initialState, status: get().status })
		},
		transcode: async ({ index, ext = '.mp4' }) => {
			const { items, status } = get()
			const item = items[index]
			if (!item) return
			set(({ items }) => {
				items[index] = { ...item, status: 'loading' }
			})

			while (status !== 'loaded') {
				if (get().status === 'loaded') break
				await new Promise(res => {
					setTimeout(() => {
						res(null)
					}, 1000)
				}).catch(console.error)
			}
			const { name, path: inputPath } = item.inputFile
			if (!inputPath) return
			const outputPath = `${name.split('.')[0]}${ext}`
			try {
				await ffmpeg.writeFile(inputPath, await fetchFile(item.inputFile))
				await ffmpeg.exec(['-i', inputPath, outputPath])
				const fileData = await ffmpeg.readFile(outputPath)
				const data = new Uint8Array(fileData as ArrayBuffer)
				set(({ items }) => {
					items[index] = {
						...item,
						outputPath,
						status: 'done',
						outputURL: URL.createObjectURL(
							new Blob([data.buffer], { type: `video/${ext.split('.')[1]}` })
						),
					}
				})
			} catch (e) {
				console.error(e)
				set(({ items }) => {
					items[index] = { ...item, status: 'idle' }
				})
			}
		},
	})
)
const isChromium = () => {
	const ua = navigator.userAgent
	const isChromium = ua.includes('Chrome') || ua.includes('Chromium')
	const isEdge = ua.includes('Edg')
	const isOpera = ua.includes('OPR')
	const isBrave = ua.includes('Brave')

	return isChromium && !isEdge && !isOpera && !isBrave
}
