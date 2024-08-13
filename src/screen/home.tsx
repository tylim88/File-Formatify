import {
	Dropzone,
	FooterSocial,
	Title,
	VideoList,
	VideoMainControls,
	DropzoneMini,
	Points,
} from '@/component'
import { Stack } from '@mantine/core'
import { useFFmpegStore } from '@/stores'
import {
	IconAdOff,
	IconPlant,
	IconFlare,
	IconHtml,
	IconDevices,
	IconFileDelta,
	IconSettingsStar,
} from '@tabler/icons-react'
import { videosTypes } from '@/constants'

const points = [
	{
		Icon: IconPlant,
		title: 'Free',
		text: 'Enjoy unlimited access to powerful video conversion tools without spending a dime, with no hidden costs or subscriptions',
	},
	{
		Icon: IconAdOff,
		title: 'Ad-Free Experience',
		text: 'Convert your videos without interruptions. Our website is completely free of ads, so you can focus on what matters most—getting your work done efficiently.',
	},
	{
		Icon: IconFlare,
		title: 'No Artificial Restrictions',
		text: 'We believe in giving you full control. Convert and compress videos without any hidden limits on file size or duration.',
	},
	{
		Icon: IconHtml,
		title: 'Web-Based Convenience',
		text: ' No downloads, no installations. Access our video converter from any device, anywhere. Simply open your browser and start converting.',
	},
	{
		Icon: IconDevices,
		title: 'Client-Side Processing',
		text: 'Your privacy is our priority. All conversions are done directly on your device, ensuring that your files never leave your computer.',
	},
	{
		Icon: IconFileDelta,
		title: 'Supports Multiple Formats',
		text: 'Whether it’s MP4, AVI, MKV, or any other format, our converter handles them all with ease. Convert between dozens of video formats effortlessly.',
	},
	{
		Icon: IconSettingsStar,
		title: 'Customizable Settings',
		text: 'Tailor your conversions to your specific needs. Adjust resolution, bitrate, and more with easy-to-use settings for a truly personalized experience.',
	},
]

export const Home = () => {
	const items = useFFmpegStore(state => state.items)
	const hasItems = items.length > 0

	return (
		<Stack gap={0} align="center" justify="start" h="100%" px={0}>
			<Title />
			<Stack
				gap="sm"
				align="center"
				justify={'start'}
				style={{
					flexGrow: 1,
				}}
			>
				{hasItems ? (
					<>
						<VideoMainControls />
						<DropzoneMini
							onDrop={useFFmpegStore.getState().addFiles}
							accept={videosTypes}
						/>
						<VideoList />
					</>
				) : (
					<>
						<Dropzone
							onDrop={useFFmpegStore.getState().addFiles}
							accept={videosTypes}
						/>
						<Points items={points} />
					</>
				)}
			</Stack>
			<FooterSocial />
		</Stack>
	)
}
