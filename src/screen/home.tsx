import { DropzoneButton, FooterSocial, Title, VideoList } from '@/component'
import { Container, DEFAULT_THEME } from '@mantine/core'
import { useFFmpegStore } from '@/stores'

export const Home = () => {
	const item = useFFmpegStore(state => state.items)

	return (
		<Container
			size="sm"
			display="flex"
			style={{ flexDirection: 'column', gap: DEFAULT_THEME.spacing.xl }}
			h="100%"
		>
			<Title />
			<Container
				display="flex"
				style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
			>
				{item.length > 0 ? <VideoList /> : <DropzoneButton />}
			</Container>
			<FooterSocial />
		</Container>
	)
}
