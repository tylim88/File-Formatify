import { useFFmpegAudioStore } from './ffmpegAudio'
import { useFFmpegVideoStore } from './ffmpegVideo'
import { videoTypes, videoPoints, audioPoints, audioTypes } from '@/constants'
export const modes = {
	video: {
		store: useFFmpegVideoStore,
		types: videoTypes,
		points: videoPoints,
		title1: 'Video Converter',
		title2: 'Support .flv .mp4 .mkv .webm .wmv and more!',
	},
	audio: {
		store: useFFmpegAudioStore,
		points: audioPoints,
		types: audioTypes,
		title1: 'Audio Converter',
		title2: 'Support .mp3 .wav .mkv .aac .flac and more!',
	},
} as const

export * from './ffmpeg'
export * from './ffmpegAudio'
export * from './ffmpegVideo'
