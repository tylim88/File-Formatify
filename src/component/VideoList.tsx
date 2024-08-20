import {
	Table,
	Text,
	Checkbox,
	ActionIcon,
	Loader,
	Center,
	Stack,
	Grid,
	Flex,
} from '@mantine/core'
import { useFFmpegVideoStore } from '@/stores'
import byteSize from 'byte-size'
import { IconTrashX } from '@tabler/icons-react'
import prettyMilliseconds from 'pretty-ms'
import { useIsSmallestBreakpoint } from '@/hooks'
export const VideoList = () => {
	const items = useFFmpegVideoStore(state => state.items)
	const selectedUUIDs = useFFmpegVideoStore(state => state.selectedUUIDs)
	const isMobile = useIsSmallestBreakpoint()

	return (
		<>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>
							<Checkbox
								aria-label="Select row"
								checked={selectedUUIDs.length === items.length}
								onChange={event =>
									useFFmpegVideoStore.setState({
										selectedUUIDs: event.currentTarget.checked
											? items.map(({ uuid }) => uuid)
											: [],
									})
								}
							/>
						</Table.Th>
						<Table.Th ta="center">File</Table.Th>
						{isMobile ? null : (
							<>
								<Table.Th ta="center">Size</Table.Th>
								<Table.Th ta="center">Time</Table.Th>
							</>
						)}
						<Table.Th />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{items.map(item => {
						const {
							inputFile: { name, size },
							uuid,
							status,
						} = item
						const time =
							status === 'converted'
								? prettyMilliseconds(item.duration)
								: status === 'error'
									? 'error'
									: '-'
						const byte = byteSize(size)
						const sizeText = byte.value + ' ' + byte.unit

						return (
							<Table.Tr key={uuid}>
								<Table.Td>
									<Checkbox
										aria-label="Select row"
										checked={selectedUUIDs.includes(uuid)}
										onChange={event =>
											useFFmpegVideoStore.setState({
												selectedUUIDs: event.currentTarget.checked
													? [...selectedUUIDs, uuid]
													: selectedUUIDs.filter(item => item !== uuid),
											})
										}
									/>
								</Table.Td>
								<Table.Td>
									<Stack gap={0}>
										<Text
											style={{
												overflowWrap: 'break-word',
											}}
											ta="start"
											miw="16rem"
										>
											{name}
										</Text>
										{isMobile ? (
											<Grid>
												<Grid.Col span={6}>
													<Text ta="left" fw="bold" size="sm">
														{sizeText}
													</Text>
												</Grid.Col>
												<Grid.Col span={6}>
													{status === 'processing' ? (
														<Flex h="100%" w="100%" justify="end">
															<Loader size="xs" color="white" />
														</Flex>
													) : (
														<Text ta="right" fw="bold" size="sm">
															{time}
														</Text>
													)}
												</Grid.Col>
											</Grid>
										) : null}
									</Stack>
								</Table.Td>
								{isMobile ? null : (
									<>
										<Table.Td>
											<Text truncate>{sizeText}</Text>
										</Table.Td>
										<Table.Td>
											{status === 'processing' ? (
												<Center>
													<Loader size="xs" color="white" />
												</Center>
											) : (
												<Text>{time}</Text>
											)}
										</Table.Td>
									</>
								)}
								<Table.Td>
									<ActionIcon
										px={0}
										color="dark"
										variant="transparent"
										onClick={() => {
											useFFmpegVideoStore.getState().removeFiles([uuid])
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
		</>
	)
}
