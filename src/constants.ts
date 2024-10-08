import {
	IconAdOff,
	IconPlant,
	IconFlare,
	IconHtml,
	IconDevices,
	IconFileDelta,
	IconSettingsStar,
} from '@tabler/icons-react'
import { useFFmpegAudioStore } from '@/stores/ffmpegAudio'
import { useFFmpegVideoStore } from '@/stores/ffmpegVideo'

export const videoFormats = [
	{ mime: 'video/mp4', ext: '.mp4' },
	{ mime: 'video/x-flv', ext: '.flv' },
	{ mime: 'video/x-msvideo', ext: '.avi' },
	{ mime: 'video/quicktime', ext: '.mov' },
	{ mime: 'video/x-matroska', ext: '.mkv' },
	{ mime: 'video/webm', ext: '.webm' }, // https://github.com/ffmpegwasm/ffmpeg.wasm/issues/679#issuecomment-1987188448
	{ mime: 'video/ogg', ext: '.ogv' },
	{ mime: 'video/mpeg', ext: '.mpeg' },
	{ mime: 'video/x-ms-wmv', ext: '.wmv' },
	{ mime: 'video/x-m4v', ext: '.m4v' },
	{ mime: 'video/x-ms-asf', ext: '.asf' },
	{ mime: 'video/x-ms-vob', ext: '.vob' },
	{ mime: 'video/mp2t', ext: '.ts' }, // MPEG-2 Transport Stream
	{ mime: 'video/x-f4v', ext: '.f4v' }, // Adobe Flash MP4
	{ mime: 'video/x-mpegurl', ext: '.m3u8' }, // HLS Streaming format
	{ mime: 'video/h264', ext: '.h264' }, // Raw H.264 video format
	// below extension result in errors
	// { mime: 'video/3gpp', ext: '.3gp' },
	// { mime: 'video/3gpp2', ext: '.3g2' },
	// { mime: 'video/h265', ext: '.h265' }, // Raw H.265/HEVC video format
	// { mime: 'video/x-sgi-movie', ext: '.movie' }, // SGI Movie format
	// { mime: 'video/x-jpeg', ext: '.mjpg' }, // Motion JPEG Video
] as const

export const videoExtensions = videoFormats.map(({ ext }) => ext)
export const videoMimes = videoFormats.map(({ mime }) => mime)

export const videoTypes = [...videoExtensions, ...videoMimes]

export const videoPoints = [
	{
		Icon: IconPlant,
		title: 'Free',
		text: 'Enjoy unlimited access to powerful video conversion tools without spending a dime, with no hidden costs or subscriptions',
	},
	{
		Icon: IconAdOff,
		title: 'Ad-Free Experience',
		text: 'Convert your videos without interruptions. Our website is completely free of ads, so you can focus on what matters most—getting your work done efficiently.',
	},
	{
		Icon: IconFlare,
		title: 'No Artificial Restrictions',
		text: 'We believe in giving you full control. Convert and compress videos without any hidden limits on file size or duration.',
	},
	{
		Icon: IconHtml,
		title: 'Web-Based Convenience',
		text: ' No downloads, no installations. Access our video converter from any device, anywhere. Simply open your browser and start converting.',
	},
	{
		Icon: IconDevices,
		title: 'Client-Side Processing',
		text: 'Your privacy is our priority. All conversions are done directly on your device, ensuring that your files never leave your computer.',
	},
	{
		Icon: IconFileDelta,
		title: 'Supports Multiple Formats',
		text: 'Whether it’s MP4, AVI, MKV, or any other format, our converter handles them all with ease. Convert between dozens of video formats effortlessly.',
	},
	{
		Icon: IconSettingsStar,
		title: 'Customizable Settings',
		text: 'Tailor your conversions to your specific needs. Adjust resolution, bitrate, and more with easy-to-use settings.',
	},
]

const audioFormats = [
	{ mime: 'audio/mpeg', ext: '.mp3' },
	{ mime: 'audio/wav', ext: '.wav' },
	{ mime: 'audio/flac', ext: '.flac' },
	{ mime: 'audio/aac', ext: '.aac' },
	{ mime: 'audio/ogg', ext: '.ogg' },
	{ mime: 'audio/midi', ext: '.midi' },
	{ mime: 'audio/x-m4a', ext: '.m4a' },
	{ mime: 'audio/x-wav', ext: '.wav' },
	{ mime: 'audio/x-flac', ext: '.flac' },
	{ mime: 'audio/ogg', ext: '.oga' },
	{ mime: 'audio/opus', ext: '.opus' },
	{ mime: 'audio/x-aiff', ext: '.aiff' },
	{ mime: 'audio/x-matroska', ext: '.mka' },
	{ mime: 'audio/amr', ext: '.amr' },
	{ mime: 'audio/aiff', ext: '.aif' },
	{ mime: 'audio/x-aac', ext: '.aac' },
	{ mime: 'audio/3gpp', ext: '.3gp' },
	{ mime: '', ext: '.mp2' }, // MPEG-2 Audio
	{ mime: '', ext: '.ac3' }, // Dolby Digital AC-3
	{ mime: '', ext: '.alac' }, // Apple Lossless Audio Codec
	{ mime: '', ext: '.dsd' }, // Direct Stream Digital
	{ mime: '', ext: '.dts' }, // Digital Theater Systems
	{ mime: '', ext: '.w64' }, // Sony Wave64
	{ mime: '', ext: '.wv' }, // WavPack
	{ mime: '', ext: '.tta' }, // True Audio
	{ mime: '', ext: '.mka' }, // Matroska Audio
	{ mime: '', ext: '.cda' }, // CD Audio Track
	{ mime: '', ext: '.gsm' }, // GSM 6.10
	{ mime: '', ext: '.ra' }, // RealAudio
	{ mime: '', ext: '.voc' }, // Creative Voice
	{ mime: '', ext: '.caf' }, // Core Audio Format
	{ mime: '', ext: '.adts' }, // Audio Data Transport Stream
	{ mime: '', ext: '.qcp' }, // Qualcomm PureVoice
	{ mime: '', ext: '.tak' }, // Tom's Audio Kompressor
	{ mime: '', ext: '.m4b' }, // MPEG-4 Audio Book
	{ mime: '', ext: '.m4r' }, // MPEG-4 Ringtone
	{ mime: '', ext: '.ape' }, // Monkey's Audio
] as const

export const audioExtensions = [...new Set(audioFormats.map(({ ext }) => ext))]
export const audioMimes = [...new Set(audioFormats.map(({ mime }) => mime))]

export const audioTypes = [...audioExtensions, ...audioMimes]

export const audioPoints = [
	{
		Icon: IconPlant,
		title: 'Free',
		text: 'Enjoy unlimited access to powerful audio conversion tools without spending a dime, with no hidden costs or subscriptions.',
	},
	{
		Icon: IconAdOff,
		title: 'Ad-Free Experience',
		text: 'Convert your audio files without interruptions. Our website is completely free of ads, so you can focus on what matters most—getting your work done efficiently.',
	},
	{
		Icon: IconFlare,
		title: 'No Artificial Restrictions',
		text: 'We believe in giving you full control. Convert and compress audio files without any hidden limits on file size or duration.',
	},
	{
		Icon: IconHtml,
		title: 'Web-Based Convenience',
		text: 'No downloads, no installations. Access our audio converter from any device, anywhere. Simply open your browser and start converting.',
	},
	{
		Icon: IconDevices,
		title: 'Client-Side Processing',
		text: 'Your privacy is our priority. All conversions are done directly on your device, ensuring that your files never leave your computer.',
	},
	{
		Icon: IconFileDelta,
		title: 'Supports Multiple Formats',
		text: 'Whether it’s MP3, WAV, FLAC, or any other format, our converter handles them all with ease. Convert between dozens of audio formats effortlessly.',
	},
	{
		Icon: IconSettingsStar,
		title: 'Customizable Settings',
		text: 'Tailor your conversions to your specific needs. Adjust bitrate, sample rate, and more with easy-to-use settings.',
	},
]

export const audioSamplingRates = [
	'0',
	'8000',
	'11025',
	'22050',
	'32000',
	'44100',
	'48000',
	'96000',
	'192000',
] as const

export const audioBitrates = [
	'0',
	'64',
	'96',
	'128',
	'160',
	'192',
	'256',
	'320',
	'384',
] as const

export const audioChannels = ['0', 'mono', 'stereo'] as const
