import { persistent } from './utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'
import { FileWithPath } from '@mantine/dropzone'
import { videoExtensions } from '@/constants'
import { v4 } from 'uuid'

const initialState = {
	isLoading: false,
	packageStatus: 'idle' as const,
	message: null,
	items: [],
	settings: { ext: videoExtensions[0]!, height: 0, width: 0, bitrate: 0 },
}
const ffmpeg = new FFmpeg()
export const useFFmpegStore = persistent<{
	load: () => void
	downloadSelected: (selectedUUIDs: string[]) => void
	packageStatus: 'idle' | 'loading' | 'loaded'
	message: null | string
	convertSelected: (props: {
		autoDownload: boolean
		selectedUUIDs: string[]
	}) => void
	settings: {
		ext: string
		height: number | string
		width: number | string
		bitrate: number | string
	}
	items: ((
		| {
				outputPath: string
				outputURL: string
				status: 'converted'
				link: HTMLAnchorElement
				duration: number
		  }
		| { status: 'processing' | 'idle' }
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
			convertSelected: async ({ autoDownload, selectedUUIDs }) => {
				clearDownload(selectedUUIDs)
				const {
					items,
					packageStatus: status,
					settings: { ext },
				} = get()
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
					try {
						const startTime = new Date()
						await ffmpeg.writeFile(inputPath, await fetchFile(item.inputFile))
						await ffmpeg.exec(['-i', inputPath, outputPath])
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
									link: download({ outputPath, outputURL }),
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
			downloadSelected: selectedUUIDs => {
				const { items } = get()
				items.forEach(item => {
					if (
						item.status === 'converted' &&
						selectedUUIDs.includes(item.uuid)
					) {
						download({ ...item })
					}
				})
			},
			addFiles: files => {
				set({
					items: [
						...get().items,
						...files.map(file => {
							return {
								status: 'idle' as const,
								inputFile: file,
								uuid: v4(),
							}
						}),
					],
				})
			},
			removeFiles: file_uuids => {
				set({
					items: get().items.filter(({ uuid }) => {
						return !file_uuids.includes(uuid)
					}),
				})
				clearDownload(file_uuids)
			},
		}
	}
)
const isChromium = () => {
	const ua = navigator.userAgent
	const isChromium = ua.includes('Chrome') || ua.includes('Chromium')
	const isEdge = ua.includes('Edg')
	const isOpera = ua.includes('OPR')
	const isBrave = ua.includes('Brave')

	return isChromium && !isEdge && !isOpera && !isBrave
}

const download = ({
	outputURL,
	outputPath,
}: {
	outputURL: string
	outputPath: string
}) => {
	const link = document.createElement('a')
	link.href = outputURL
	link.setAttribute('download', outputPath)
	document.body.appendChild(link)
	link.click()
	return link
}
