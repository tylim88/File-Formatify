import {
	DropzoneButton,
	FooterSocial,
	Title,
	VideoList,
	VideoMainControls,
} from '@/component'
import { Container, Stack } from '@mantine/core'
import { useFFmpegStore } from '@/stores'

export const Home = () => {
	const items = useFFmpegStore(state => state.items)

	const hasItems = items.length > 0

	return (
		<Container
			size="sm"
			display="flex"
			w="100%"
			style={{
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			h="100%"
		>
			<Title />
			<Stack
				maw="100%"
				display="flex"
				align="center"
				justify={hasItems ? 'start' : 'center'}
				style={{
					flexGrow: 1,
				}}
			>
				{hasItems ? (
					<>
						<VideoMainControls />
						<VideoList />
					</>
				) : (
					<DropzoneButton />
				)}
			</Stack>
			<FooterSocial />
		</Container>
	)
}
