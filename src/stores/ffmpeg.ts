import { persistent } from './utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'
import { FileWithPath } from '@mantine/dropzone'
import { videoExtensions } from '@/constants'
import { v4 } from 'uuid'
import { download, isChromium } from '@/utils'

const initialState = {
	isLoading: false,
	packageStatus: 'idle' as const,
	message: null,
	items: [],
	settings: {
		ext: videoExtensions[0]!,
		height: 0,
		width: 0,
		videoBitrate: 0,
		audioBitrate: 0,
	},
	selectedUUIDs: [],
}
const ffmpeg = new FFmpeg()
export const useFFmpegStore = persistent<{
	selectedUUIDs: string[]
	load: () => void
	downloadSelected: () => void
	packageStatus: 'idle' | 'loading' | 'loaded'
	message: null | string
	convertSelected: (props: { autoDownload: boolean }) => void
	settings: {
		ext: string
		height: number | string
		width: number | string
		videoBitrate: number | string
		audioBitrate: number | string
	}
	items: ((
		| {
				outputPath: string
				outputURL: string
				status: 'converted'
				link: HTMLAnchorElement
				duration: number
		  }
		| { status: 'processing' | 'idle' | 'error' }
	) & { inputFile: FileWithPath; uuid: string })[]
	addFiles: (file: FileWithPath[]) => void
	removeFiles: (file_uuids: string[]) => void
}>(
	{
		name: 'ffmpeg',
		keysToPersist: [],
	},
	(set, get) => {
		const clearDownload = (uuids: string[]) => {
			const { items } = get()
			uuids.forEach(uuid => {
				const item = items.find(item => item.uuid === uuid)
				if (item?.status !== 'converted') return
				try {
					URL.revokeObjectURL(item.outputURL)
					document.body.removeChild(item.link)
				} catch (e) {
					console.error(e)
				}
			})
		}

		return {
			...initialState,
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
			reset: () => {
				set({ ...initialState, packageStatus: get().packageStatus })
			},
			convertSelected: async ({ autoDownload }) => {
				const {
					items,
					packageStatus: status,
					settings: { ext, videoBitrate, audioBitrate, width, height },
					selectedUUIDs,
				} = get()
				clearDownload(selectedUUIDs)
				set({ items: items.map(item => ({ ...item, status: 'processing' })) })

				while (status !== 'loaded') {
					if (get().packageStatus === 'loaded') break
					await new Promise(res => {
						setTimeout(() => {
							res(null)
						}, 1000)
					}).catch(console.error)
				}
				items.forEach(async (item, index) => {
					if (
						item.status === 'processing' ||
						!selectedUUIDs.includes(item.uuid)
					)
						return
					const { name, path: inputPath } = item.inputFile
					if (!inputPath) return
					const outputPath = `${name.split('.')[0]}${ext}`
					const videoBitrateArr =
						parseInt(`${videoBitrate}`) > 0 ? ['-b:v', `${videoBitrate}`] : []
					const audioBitrateArr =
						parseInt(`${audioBitrate}`) > 0 ? ['-b:a', `${videoBitrate}`] : []
					const resolution =
						parseInt(`${width}`) > 0 || parseInt(`${height}`) > 0
							? ['-vf', `scale=${width || -1}:${height || -1}`]
							: []
					try {
						const startTime = new Date()
						await ffmpeg.writeFile(inputPath, await fetchFile(item.inputFile))
						await ffmpeg.exec([
							'-i',
							inputPath,
							...videoBitrateArr,
							...audioBitrateArr,
							...resolution,
							...(ext === '.webm'
								? [
										'-fflags',
										'+genpts',
										'-preset',
										'ultrafast',
										'-c:v',
										'libvpx',
										'-c:a',
										'libvorbis',
										'-crf',
										'23',
										'-threads',
										'0',
									]
								: []),
							outputPath,
						])
						const fileData = await ffmpeg.readFile(outputPath)
						const endTime = new Date()
						const data = new Uint8Array(fileData as ArrayBuffer)
						const outputURL = URL.createObjectURL(
							new Blob([data.buffer], { type: `video/${ext.split('.')[1]}` })
						)
						if (
							autoDownload &&
							get().items.some(item_ => item_.uuid === item.uuid) // don't download if user remove from list
						) {
							set(({ items }) => {
								items[index] = {
									...item,
									outputPath,
									status: 'converted',
									outputURL,
									// @ts-expect-error 123
									duration: endTime - startTime,
									// @ts-expect-error 123
									link: download({ outputPath, href: outputURL }),
								}
							})
						}
					} catch (e) {
						console.error(e)
						set(({ items }) => {
							items[index] = { ...item, status: 'idle' }
						})
					}
				})
			},
			downloadSelected: () => {
				const { items, selectedUUIDs } = get()
				items.forEach(item => {
					if (
						item.status === 'converted' &&
						selectedUUIDs.includes(item.uuid)
					) {
						download({ ...item, href: item.outputURL })
					}
				})
			},
			addFiles: files => {
				const { items, selectedUUIDs } = get()
				const newItems = files.map(file => {
					return {
						status: 'idle' as const,
						inputFile: file,
						uuid: v4(),
					}
				})
				set({
					selectedUUIDs: [...selectedUUIDs, ...newItems.map(item => item.uuid)],
					items: [...items, ...newItems],
				})
			},
			removeFiles: file_uuids => {
				const { selectedUUIDs } = get()
				set({
					items: get().items.filter(({ uuid }) => {
						return !file_uuids.includes(uuid)
					}),
					selectedUUIDs: selectedUUIDs.filter(
						item => !selectedUUIDs.includes(item)
					),
				})
				clearDownload(file_uuids)
			},
		}
	}
)
