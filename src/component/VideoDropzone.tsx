import { Text, Group, rem } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { IconVideo, IconX, IconUpload } from '@tabler/icons-react'
import { useFFmpegStore } from '@/stores'
import { videosTypes } from '@/constants'

export const VideoDropzone = () => {
	return (
		<Dropzone
			onDrop={useFFmpegStore.getState().addFiles}
			bg={'#EFEEF3'}
			style={{ border: 'solid' }}
			accept={videosTypes}
		>
			<Group
				justify="center"
				gap="xl"
				mih={220}
				style={{ pointerEvents: 'none' }}
			>
				<Dropzone.Accept>
					<IconUpload
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-blue-6)',
						}}
						stroke={1.5}
					/>
				</Dropzone.Accept>
				<Dropzone.Reject>
					<IconX
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-red-6)',
						}}
						stroke={1.5}
					/>
				</Dropzone.Reject>
				<Dropzone.Idle>
					<IconVideo
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-dimmed)',
						}}
						stroke={1.5}
					/>
				</Dropzone.Idle>

				<div>
					<Text size="xl" inline>
						Drag videos here or click to select files
					</Text>
					<Text size="sm" c="dimmed" inline mt={7}>
						Attach as many files as you like, no size limitation!
					</Text>
				</div>
			</Group>
		</Dropzone>
	)
}
