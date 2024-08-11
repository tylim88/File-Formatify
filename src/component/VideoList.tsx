import {
	Table,
	Button,
	Text,
	Stack,
	Checkbox,
	ActionIcon,
	Flex,
	Loader,
	Center,
	Grid,
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
	const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([])
	const [autoDownload, setIsAutoDownload] = useState(true)
	const isNoSelection = selectedUUIDs.length === 0
	return (
		<Stack>
			<Grid>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'end' }}>
					<Button
						w="8rem"
						leftSection={<IconSettings size={14} />}
						variant="default"
					>
						Settings
					</Button>
				</Grid.Col>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'start' }}>
					<Button
						w="8rem"
						leftSection={<IconPlayerPlay size={14} />}
						variant="default"
						disabled={
							isNoSelection && items.some(item => item.status === 'idle')
						}
						onClick={() => {
							useFFmpegStore
								.getState()
								.convertSelected({ autoDownload, selectedUUIDs })
						}}
					>
						Convert
					</Button>
				</Grid.Col>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'end' }}>
					<Button
						w="8rem"
						leftSection={<IconDownload size={14} />}
						disabled={
							isNoSelection || items.some(item => item.status !== 'converted')
						}
						variant="default"
						onClick={() =>
							useFFmpegStore.getState().downloadSelected(selectedUUIDs)
						}
					>
						<Text>Download</Text>
					</Button>
				</Grid.Col>
				<Grid.Col span={6} display="flex" style={{ justifyContent: 'start' }}>
					<Button
						w="8rem"
						leftSection={<IconTrashX size={14} />}
						disabled={isNoSelection}
						variant="default"
						onClick={() => {
							useFFmpegStore.getState().removeFiles(selectedUUIDs)
							setSelectedUUIDs(state => {
								const newArr = state.filter(
									item => !selectedUUIDs.includes(item)
								)
								return newArr
							})
						}}
					>
						Delete
					</Button>
				</Grid.Col>
			</Grid>
			<Flex justify="center">
				<Checkbox
					checked={autoDownload}
					onChange={event => setIsAutoDownload(event.currentTarget.checked)}
					label="Automatically download when conversion is complete."
				/>
			</Flex>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th />
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
											setSelectedUUIDs(state => {
												const newArr = state.filter(item => item !== uuid)

												return newArr
											})
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
									{status === 'processing' ? (
										<Center>
											<Loader size="xs" />
										</Center>
									) : (
										<Text>{status === 'converted' ? item.duration : '-'}</Text>
									)}
								</Table.Td>
								{/* <Table.Td>
									<ActionIcon
										color="green"
										disabled={['idle', 'processing'].includes(status)}
										variant="transparent"
										onClick={() => {
											useFFmpegStore.getState().downloadSelected([uuid])
										}}
									>
										<IconDownload size={16} />
									</ActionIcon>
								</Table.Td>
								<Table.Td>
									{status === 'processing' ? (
										<Center>
											<Loader size="xs" />
										</Center>
									) : (
										<ActionIcon
											color="blue"
											variant="transparent"
											onClick={() => {
												useFFmpegStore.getState().convertSelected({
													autoDownload,
													selectedUUIDs: [uuid],
												})
											}}
										>
											<IconPlayerPlay size={16} />
										</ActionIcon>
									)}
								</Table.Td> */}
							</Table.Tr>
						)
					})}
				</Table.Tbody>
			</Table>
		</Stack>
	)
}
