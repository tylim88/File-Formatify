import { Button, Text, Checkbox, Grid } from '@mantine/core'
import { useFFmpegVideoStore } from '@/stores'
import { useState } from 'react'
import {
	IconPlayerPlay,
	IconSettings,
	IconDownload,
	IconTrashX,
	IconMail,
} from '@tabler/icons-react'
import { VideoSettings } from './VideoSettings'
import { FeedBack } from './FeedBack'
import { useDisclosure } from '@mantine/hooks'
import { isChromium } from '@/utils'

export const VideoMainControls = () => {
	const items = useFFmpegVideoStore(state => state.items)
	const selectedUUIDs = useFFmpegVideoStore(state => state.selectedUUIDs)
	const [autoDownload, setIsAutoDownload] = useState(true)
	const isNoSelection = selectedUUIDs.length === 0
	const [isSettingsOpened, { open: openSettings, close: closeSettings }] =
		useDisclosure(false)
	const [isFeedbackOpened, { open: openFeedback, close: closeFeedback }] =
		useDisclosure(false)
	return (
		<>
			<VideoSettings isOpened={isSettingsOpened} close={closeSettings} />
			<FeedBack isOpened={isFeedbackOpened} close={closeFeedback} />
			<Grid>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'end' }}>
					<Button
						onClick={openSettings}
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
							isNoSelection || !items.some(item => item.status !== 'processing')
						}
						onClick={() => {
							useFFmpegVideoStore.getState().convertSelected({ autoDownload })
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
							isNoSelection || !items.some(item => item.status === 'converted')
						}
						variant="default"
						onClick={() => useFFmpegVideoStore.getState().downloadSelected()}
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
							useFFmpegVideoStore.getState().removeFiles(selectedUUIDs)
						}}
					>
						Delete
					</Button>
				</Grid.Col>
				<Grid.Col span={12} display="flex" style={{ justifyContent: 'center' }}>
					<Button
						w="8rem"
						leftSection={<IconMail size={14} />}
						variant="default"
						onClick={openFeedback}
					>
						Feedback
					</Button>
				</Grid.Col>
			</Grid>
			<Checkbox
				checked={autoDownload}
				onChange={event => setIsAutoDownload(event.currentTarget.checked)}
				label="Automatically download when conversion is complete."
			/>
			{isChromium() ? (
				<Text size="xs" fs="italic">
					For faster conversion, please use Firefox
				</Text>
			) : null}
		</>
	)
}
