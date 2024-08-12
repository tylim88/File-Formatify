import {
	Modal,
	Grid,
	Stack,
	Select,
	NumberInput,
	Flex,
	Button,
} from '@mantine/core'
import { videoExtensions } from '@/constants'
import { useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useFFmpegStore } from '@/stores'

export const VideoSettings = ({
	isOpened,
	close,
}: {
	isOpened: boolean
	close: () => void
}) => {
	const [videoBitrate, setVideoBitrate] = useState<string | number>(0)
	const [audioBitrate, setAudioBitrate] = useState<string | number>(0)
	const [height, setHeight] = useState<string | number>(0)
	const [width, setWidth] = useState<string | number>(0)
	const [ext, setExt] = useState<string>(videoExtensions[0]!)
	return (
		<Modal title="Settings" opened={isOpened} onClose={close} centered>
			<Stack>
				<Grid>
					<Grid.Col span={12}>
						<Select
							value={ext}
							onChange={v => setExt(v || videoExtensions[0]!)}
							label="Output"
							data={videoExtensions}
							defaultValue={videoExtensions[0] || null}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<NumberInput
							decimalScale={0}
							hideControls
							label="Video Bitrate"
							min={0}
							description="Set to 0 to keep the original video parameter."
							value={videoBitrate}
							onChange={setVideoBitrate}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<NumberInput
							decimalScale={0}
							hideControls
							label="Audio Bitrate"
							min={0}
							description="Set to 0 to keep the original video parameter."
							value={audioBitrate}
							onChange={setAudioBitrate}
						/>
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={6}>
						<NumberInput
							decimalScale={0}
							hideControls
							label="Width"
							min={0}
							description="Set to 0 to keep the original video parameter."
							value={width}
							onChange={setWidth}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<NumberInput
							decimalScale={0}
							hideControls
							label="height"
							min={0}
							description="Set to 0 to keep the original video parameter."
							value={height}
							onChange={setHeight}
						/>
					</Grid.Col>
				</Grid>
				<Flex justify="space-evenly">
					<Button
						leftSection={<IconCheck size={14} />}
						variant="default"
						onClick={() => {
							useFFmpegStore.setState({
								settings: {
									ext,
									videoBitrate,
									audioBitrate,
									height,
									width,
								},
							})
							close()
						}}
					>
						Save
					</Button>
					<Button
						leftSection={<IconX size={14} />}
						variant="default"
						onClick={close}
					>
						Exit
					</Button>
				</Flex>
			</Stack>
		</Modal>
	)
}
