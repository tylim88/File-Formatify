import { persistent } from './utils'
import { fetchFile } from '@ffmpeg/util'
import { FileWithPath } from '@mantine/dropzone'
import { videoExtensions } from '@/constants'
import { v4 } from 'uuid'
import { download } from '@/utils'
import { useFFmpegStore, ffmpeg } from './ffmpeg'

const initialState = {
	items: [],
	settings: {
		ext: videoExtensions[0]!,
		height: 0,
		width: 0,
		videoBitrate: 0,
		audioBitrate: '0',
	},
	selectedUUIDs: [],
}

export const useFFmpegVideoStore = persistent<{
	selectedUUIDs: string[]
	downloadSelected: () => void
	convertSelected: (props: { autoDownload: boolean }) => void
	settings: {
		ext: string
		height: number | string
		width: number | string
		videoBitrate: number | string
		audioBitrate: string
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
		name: 'ffmpegVideo',
		keysToPersist: ['settings'],
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

			reset: () => {
				set({ ...initialState })
			},
			convertSelected: async ({ autoDownload }) => {
				const {
					items,
					settings: { ext, videoBitrate, audioBitrate, width, height },
					selectedUUIDs,
				} = get()
				clearDownload(selectedUUIDs)
				set({ items: items.map(item => ({ ...item, status: 'processing' })) })

				while (useFFmpegStore.getState().packageStatus !== 'loaded') {
					if (useFFmpegStore.getState().packageStatus === 'loaded') break
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
									duration: endTime.valueOf() - startTime.valueOf(),
									// @ts-expect-error 123
									link: download({ outputPath, href: outputURL }),
								}
							})
						}
					} catch (e) {
						console.error(e)
						set(({ items }) => {
							items[index] = { ...item, status: 'error' }
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
				const { selectedUUIDs, items } = get()
				set({
					items: items.filter(({ uuid }) => {
						return !file_uuids.includes(uuid)
					}),
					selectedUUIDs: selectedUUIDs.filter(
						item => !file_uuids.includes(item)
					),
				})
				clearDownload(file_uuids)
			},
		}
	}
)
