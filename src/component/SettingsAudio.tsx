import {
	Modal,
	Grid,
	Stack,
	Select,
	NumberInput,
	Flex,
	Button,
} from '@mantine/core'
import {
	audioExtensions,
	audioSamplingRates,
	audioBitrates,
	audioChannels,
} from '@/constants'
import { useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useFFmpegAudioStore } from '@/stores'

export const SettingsAudio = ({
	isOpened,
	close,
}: {
	isOpened: boolean
	close: () => void
}) => {
	const [bitrate, setBitrate] = useState<string>('0')
	const [sampleRate, setSampleRate] = useState<string>('0')
	const [channel, setChannel] = useState<string>('0')
	const [volume, setVolume] = useState<string | number>(1)
	const [ext, setExt] = useState<string>(audioExtensions[0]!)
	return (
		<Modal title="Settings" opened={isOpened} onClose={close} centered>
			<Stack>
				<Grid>
					<Grid.Col span={12}>
						<Select
							ta="left"
							value={ext}
							onChange={v => setExt(v || audioExtensions[0]!)}
							label="Output"
							data={audioExtensions}
							defaultValue={audioExtensions[0] || null}
							styles={{
								label: { fontWeight: 'bold' },
							}}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Select
							ta="left"
							description="Leave it 0 to keep the original video parameter."
							value={bitrate}
							onChange={v => setBitrate(v || audioBitrates[0])}
							label="Bitrate (kbps)"
							data={audioBitrates}
							defaultValue={'0'}
							styles={{
								label: { fontWeight: 'bold' },
							}}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Select
							ta="left"
							description="Leave it 0 to keep the original video parameter."
							value={sampleRate}
							onChange={v => setSampleRate(v || audioSamplingRates[0])}
							label="Sampling Rate (Hz)"
							data={audioSamplingRates}
							defaultValue={'0'}
							styles={{
								label: { fontWeight: 'bold' },
							}}
						/>
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={6}>
						<Select
							ta="left"
							description="Leave it 0 to keep the original video parameter."
							value={channel}
							onChange={v => setChannel(v || audioChannels[0])}
							label="Channel"
							data={audioChannels}
							defaultValue={'0'}
							styles={{
								label: { fontWeight: 'bold' },
							}}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<NumberInput
							ta="left"
							decimalScale={1}
							hideControls
							suffix="x"
							label="Volume"
							min={0}
							description="Leave it 1x to keep the original video parameter."
							value={volume}
							defaultValue={1}
							onChange={setVolume}
							styles={{
								label: { fontWeight: 'bold' },
							}}
						/>
					</Grid.Col>
				</Grid>
				<Flex justify="space-evenly">
					<Button
						leftSection={<IconCheck size={14} />}
						variant="default"
						onClick={() => {
							useFFmpegAudioStore.setState({
								settings: {
									ext,
									bitrate,
									sampleRate,
									channel,
									volume,
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
						Cancel
					</Button>
				</Flex>
			</Stack>
		</Modal>
	)
}
