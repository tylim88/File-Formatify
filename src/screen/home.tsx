import { DropzoneButton, FooterSocial, Title } from '@/component'
import { Container, DEFAULT_THEME } from '@mantine/core'
export const Home = () => {
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
				<DropzoneButton />
			</Container>
			<FooterSocial />
		</Container>
	)
}
