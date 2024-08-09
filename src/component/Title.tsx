import { Title as Title_, Stack, Flex } from '@mantine/core'

export const Title = () => {
	return (
		<Stack justify="center" align="center" gap="xs" py="xl">
			<Title_ order={1}>Video Converter</Title_>
			<Flex gap="md">
				<Title_ order={3}>Free!</Title_>
				<Title_ order={3}>No Artificial Limitation!</Title_>
				<Title_ order={3}>No Ads!</Title_>
			</Flex>
			<Title_ order={5}>Support .flv .mp4 .mkv .avu .wmv and more!</Title_>
		</Stack>
	)
}
