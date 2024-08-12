import { useRef } from 'react'
import { Button, Group } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { useFFmpegStore } from '@/stores'
import { IconPlus } from '@tabler/icons-react'

export const VideoDropzoneMini = () => {
	const openRef = useRef<() => void>(null)

	return (
		<Dropzone
			w="100%"
			bg="#EFEEF3"
			style={{ border: 'solid' }}
			openRef={openRef}
			onDrop={useFFmpegStore.getState().addFiles}
		>
			<Group justify="center">
				<Button
					leftSection={<IconPlus size={14} />}
					variant="default"
					onClick={() => openRef.current?.()}
					style={{ pointerEvents: 'all' }}
				>
					Add new files
				</Button>
			</Group>
		</Dropzone>
	)
}
