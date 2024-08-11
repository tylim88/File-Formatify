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
	close: onClose,
}: {
	isOpened: boolean
	close: () => void
}) => {
	const [bitrate, setBitrate] = useState<string | number>(0)
	const [height, setHeight] = useState<string | number>(0)
	const [width, setWidth] = useState<string | number>(0)
	const [ext, setExt] = useState<string>(videoExtensions[0]!)
	return (
		<Modal title="Settings" opened={isOpened} onClose={onClose} centered>
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
					<Grid.Col span={12}>
						<NumberInput
							decimalScale={0}
							hideControls
							label="Bitrate"
							min={0}
							description="set to 0 for default"
							value={bitrate}
							onChange={setBitrate}
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
							description="set to 0 for default"
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
							description="set to 0 for default"
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
									bitrate,
									height,
									width,
								},
							})
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
