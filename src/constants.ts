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

export const videosTypes = [...videoExtensions, ...videoMimes]
