import {
	Table,
	Button,
	Text,
	Stack,
	Checkbox,
	Group,
	ActionIcon,
} from '@mantine/core'
import { useFFmpegStore } from '@/stores'
import byteSize from 'byte-size'
import { useState } from 'react'
import {
	IconPlayerPlay,
	IconSettings,
	IconDownload,
	IconTrashX,
} from '@tabler/icons-react'

export const VideoList = () => {
	const items = useFFmpegStore(state => state.items)
	const status = useFFmpegStore(state => state.conversionStatus)
	const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([])
	const isNoSelection = selectedUUIDs.length === 0
	return (
		<Stack>
			<Group justify="center">
				<Button leftSection={<IconSettings size={14} />} variant="default">
					Settings
				</Button>
				<Button
					leftSection={<IconPlayerPlay size={14} />}
					variant="default"
					disabled={isNoSelection}
					loading={status === 'loading'}
					onClick={() => {
						useFFmpegStore.getState().transcode()
					}}
				>
					Start
				</Button>
				<Button
					leftSection={<IconDownload size={14} />}
					disabled={status !== 'done' || isNoSelection}
					variant="default"
					onClick={() => {
						useFFmpegStore.getState().download()
					}}
				>
					Download
				</Button>
				<Button
					leftSection={<IconTrashX size={14} />}
					disabled={status !== 'done' || isNoSelection}
					variant="default"
					onClick={() => {
						useFFmpegStore.getState().removeFiles(selectedUUIDs)
						setSelectedUUIDs(state => {
							const newArr = state.filter(item => !selectedUUIDs.includes(item))
							return newArr
						})
					}}
				>
					Delete
				</Button>
			</Group>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>
							<Checkbox
								aria-label="Select row"
								checked={selectedUUIDs.length === items.length}
								onChange={event =>
									setSelectedUUIDs(
										event.currentTarget.checked
											? items.map(({ uuid }) => uuid)
											: []
									)
								}
							/>
						</Table.Th>
						<Table.Th>File Name</Table.Th>
						<Table.Th ta="center">Size</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{items.map(item => {
						const {
							inputFile: { name, size },
							uuid,
						} = item

						const byte = byteSize(size)
						return (
							<Table.Tr key={name}>
								<Table.Td>
									<Checkbox
										aria-label="Select row"
										checked={selectedUUIDs.includes(uuid)}
										onChange={event =>
											setSelectedUUIDs(
												event.currentTarget.checked
													? [...selectedUUIDs, uuid]
													: selectedUUIDs.filter(item => item !== uuid)
											)
										}
									/>
								</Table.Td>
								<Table.Td>
									<Text truncate="start" ta="end" miw="12rem">
										{name}
									</Text>
								</Table.Td>
								<Table.Td>
									<Text truncate>{byte.value + ' ' + byte.unit}</Text>
								</Table.Td>
								<Table.Td>
									<ActionIcon
										color="gray"
										variant="transparent"
										onClick={() => {
											useFFmpegStore.getState().removeFiles([uuid])
											setSelectedUUIDs(state => {
												const newArr = state.filter(item => item !== uuid)

												return newArr
											})
										}}
									>
										<IconTrashX size={16} />
									</ActionIcon>
								</Table.Td>
							</Table.Tr>
						)
					})}
				</Table.Tbody>
			</Table>
		</Stack>
	)
}
