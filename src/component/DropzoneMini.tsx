import { useRef } from 'react'
import { Button, Group } from '@mantine/core'
import { Dropzone, FileWithPath } from '@mantine/dropzone'
import { IconPlus } from '@tabler/icons-react'
import { textColor } from '@/styles'

export const DropzoneMini = ({
	onDrop,
	accept,
}: {
	onDrop: (files: FileWithPath[]) => void
	accept: string[]
}) => {
	const openRef = useRef<() => void>(null)

	return (
		<Dropzone
			w="100%"
			bg={textColor}
			style={{ border: 'solid' }}
			openRef={openRef}
			onDrop={onDrop}
			accept={accept}
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
