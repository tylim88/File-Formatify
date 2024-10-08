import { TablerIconsProps } from '@tabler/icons-react'
import { Text, Title, Grid } from '@mantine/core'
import { useIsSmallestBreakpoint } from '@/hooks'
import { textColor } from '@/styles'

export const Points = ({
	items,
}: {
	items: {
		Icon: (props: TablerIconsProps) => JSX.Element
		text: string
		title: string
	}[]
}) => {
	const span = useIsSmallestBreakpoint() ? 12 : 6
	return (
		<Grid py="xl">
			{items.map(({ Icon, text, title }) => {
				return (
					<Grid.Col
						p="xs"
						display="flex"
						key={text}
						span={span}
						style={{ alignItems: 'start', flexDirection: 'column' }}
					>
						<Icon size={24} color={textColor} />
						<Title order={4} ta="start">
							{title}
						</Title>
						<Text
							ta="start"
							size="sm"
							style={{
								overflowWrap: 'break-word',
							}}
						>
							{text}
						</Text>
					</Grid.Col>
				)
			})}
		</Grid>
	)
}
