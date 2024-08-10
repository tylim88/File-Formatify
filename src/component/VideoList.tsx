import { Table, Select } from '@mantine/core'
import { useFFmpegStore } from '@/stores'
import { videoFormats } from '@/constants'

const exts = videoFormats.map(({ ext }) => ext)

export const VideoList = () => {
	const items = useFFmpegStore(state => state.items)

	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Apply To All</Table.Th>
					<Table.Th>File Name</Table.Th>
					<Table.Th>New Format</Table.Th>
					<Table.Th>Convert</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{items.map(({ inputFile: { name } }) => {
					return (
						<Table.Tr key={name}>
							<Table.Td>Apply</Table.Td>
							<Table.Td>{name}</Table.Td>
							<Table.Td>
								<Select placeholder=".mp4" data={exts} />
							</Table.Td>
						</Table.Tr>
					)
				})}
			</Table.Tbody>
		</Table>
	)
}
