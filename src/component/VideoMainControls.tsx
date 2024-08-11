import { Button, Text, Checkbox, Flex, Grid } from '@mantine/core'
import { useFFmpegStore } from '@/stores'
import { useState } from 'react'
import {
	IconPlayerPlay,
	IconSettings,
	IconDownload,
	IconTrashX,
} from '@tabler/icons-react'
import { VideoSettings } from './VideoSettings'
import { useDisclosure } from '@mantine/hooks'

export const VideoMainControls = () => {
	const items = useFFmpegStore(state => state.items)
	const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([])
	const [autoDownload, setIsAutoDownload] = useState(true)
	const isNoSelection = selectedUUIDs.length === 0
	const [isOpened, { open, close }] = useDisclosure(false)
	return (
		<>
			<VideoSettings isOpened={isOpened} close={close} />
			<Grid>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'end' }}>
					<Button
						onClick={open}
						w="8rem"
						leftSection={<IconSettings size={14} />}
						variant="default"
					>
						Settings
					</Button>
				</Grid.Col>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'start' }}>
					<Button
						w="8rem"
						leftSection={<IconPlayerPlay size={14} />}
						variant="default"
						disabled={
							isNoSelection && items.some(item => item.status === 'idle')
						}
						onClick={() => {
							useFFmpegStore
								.getState()
								.convertSelected({ autoDownload, selectedUUIDs })
						}}
					>
						Convert
					</Button>
				</Grid.Col>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'end' }}>
					<Button
						w="8rem"
						leftSection={<IconDownload size={14} />}
						disabled={
							isNoSelection || items.some(item => item.status !== 'converted')
						}
						variant="default"
						onClick={() =>
							useFFmpegStore.getState().downloadSelected(selectedUUIDs)
						}
					>
						<Text>Download</Text>
					</Button>
				</Grid.Col>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'start' }}>
					<Button
						w="8rem"
						leftSection={<IconTrashX size={14} />}
						disabled={isNoSelection}
						variant="default"
						onClick={() => {
							useFFmpegStore.getState().removeFiles(selectedUUIDs)
							setSelectedUUIDs(state => {
								const newArr = state.filter(
									item => !selectedUUIDs.includes(item)
								)
								return newArr
							})
						}}
					>
						Delete
					</Button>
				</Grid.Col>
			</Grid>
			<Flex justify="center">
				<Checkbox
					checked={autoDownload}
					onChange={event => setIsAutoDownload(event.currentTarget.checked)}
					label="Automatically download when conversion is complete."
				/>
			</Flex>
		</>
	)
}
