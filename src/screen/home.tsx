import { DropzoneButton, FooterSocial, Title, VideoList } from '@/component'
import { Container, DEFAULT_THEME } from '@mantine/core'
import { useFFmpegStore } from '@/stores'

export const Home = () => {
	const items = useFFmpegStore(state => state.items)

	const hasItems = items.length > 0

	return (
		<Container
			size="sm"
			display="flex"
			style={{ flexDirection: 'column', gap: DEFAULT_THEME.spacing.xl }}
			h="100%"
		>
			<Title />
			<Container
				maw="100%"
				display="flex"
				style={{
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: hasItems ? 'start' : 'center',
				}}
			>
				{hasItems ? <VideoList /> : <DropzoneButton />}
			</Container>
			<FooterSocial />
		</Container>
	)
}
