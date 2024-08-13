import { Title as Title_, Stack } from '@mantine/core'
import { textColor } from '@/styles'

export const Title = () => {
	return (
		<Stack justify="center" align="center" gap="xs" py="xl">
			<Title_ order={1}>Video Converter</Title_>
			<Title_ style={{ color: textColor }} order={3}>
				Absolutely Free And No Artificial Restrictions!
			</Title_>
			<Title_ order={5}>Support .flv .mp4 .mkv .webm .wmv and more!</Title_>
		</Stack>
	)
}
