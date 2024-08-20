import { Text, Group, rem } from '@mantine/core'
import { Dropzone as Dropzone_, FileWithPath } from '@mantine/dropzone'
import { IconVideo, IconX, IconUpload } from '@tabler/icons-react'
import { textColor } from '@/styles'

export const Dropzone = ({
	onDrop,
	accept,
}: {
	onDrop: (files: FileWithPath[]) => void
	accept: string[]
}) => {
	return (
		<Dropzone_
			onDrop={onDrop}
			bg={textColor}
			style={{ border: 'solid' }}
			accept={accept}
		>
			<Group
				justify="center"
				gap="xl"
				mih={220}
				style={{ pointerEvents: 'none' }}
			>
				<Dropzone_.Accept>
					<IconUpload
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-blue-6)',
						}}
						stroke={1.5}
					/>
				</Dropzone_.Accept>
				<Dropzone_.Reject>
					<IconX
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-red-6)',
						}}
						stroke={1.5}
					/>
				</Dropzone_.Reject>
				<Dropzone_.Idle>
					<IconVideo
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-dimmed)',
						}}
						stroke={1.5}
					/>
				</Dropzone_.Idle>

				<div>
					<Text size="xl" inline>
						Drag files here or click to select files
					</Text>
					<Text size="sm" c="dimmed" inline mt={7}>
						Attach as many files as you like, no size or number restrictions!
					</Text>
				</div>
			</Group>
		</Dropzone_>
	)
}
