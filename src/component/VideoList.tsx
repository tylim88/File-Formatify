import {
	Table,
	Text,
	Checkbox,
	ActionIcon,
	Loader,
	Center,
} from '@mantine/core'
import { useFFmpegStore } from '@/stores'
import byteSize from 'byte-size'
import { IconTrashX } from '@tabler/icons-react'
import prettyMilliseconds from 'pretty-ms'
import { Dropzone } from '@mantine/dropzone'

export const VideoList = () => {
	const items = useFFmpegStore(state => state.items)
	const selectedUUIDs = useFFmpegStore(state => state.selectedUUIDs)
	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th />
					<Table.Th>
						<Checkbox
							aria-label="Select row"
							checked={selectedUUIDs.length === items.length}
							onChange={event =>
								useFFmpegStore.setState({
									selectedUUIDs: event.currentTarget.checked
										? items.map(({ uuid }) => uuid)
										: [],
								})
							}
						/>
					</Table.Th>
					<Table.Th ta="center">File Name</Table.Th>
					<Table.Th ta="center">Size</Table.Th>
					<Table.Th ta="center">Time</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{items.map(item => {
					const {
						inputFile: { name, size },
						uuid,
						status,
					} = item

					const byte = byteSize(size)
					return (
						<Table.Tr key={name}>
							<Table.Td>
								<ActionIcon
									color="dark"
									variant="transparent"
									onClick={() => {
										useFFmpegStore.getState().removeFiles([uuid])
									}}
								>
									<IconTrashX size={16} />
								</ActionIcon>
							</Table.Td>
							<Table.Td>
								<Checkbox
									aria-label="Select row"
									checked={selectedUUIDs.includes(uuid)}
									onChange={event =>
										useFFmpegStore.setState({
											selectedUUIDs: event.currentTarget.checked
												? [...selectedUUIDs, uuid]
												: selectedUUIDs.filter(item => item !== uuid),
										})
									}
								/>
							</Table.Td>
							<Table.Td>
								<Text
									style={{
										overflowWrap: 'break-word',
									}}
									ta="start"
									miw="16rem"
								>
									{name}
								</Text>
							</Table.Td>
							<Table.Td>
								<Text truncate>{byte.value + ' ' + byte.unit}</Text>
							</Table.Td>
							<Table.Td>
								{status === 'processing' ? (
									<Center>
										<Loader size="xs" />
									</Center>
								) : (
									<Text>
										{status === 'converted'
											? prettyMilliseconds(item.duration)
											: '-'}
									</Text>
								)}
							</Table.Td>
						</Table.Tr>
					)
				})}
			</Table.Tbody>
		</Table>
	)
}
