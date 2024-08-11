import { Table, Select, Button, Text } from '@mantine/core'
import { useFFmpegStore } from '@/stores'
import { videoFormats } from '@/constants'
import byteSize from 'byte-size'
import { useRef } from 'react'

const exts = videoFormats.map(({ ext }) => ext)

export const VideoList = () => {
	const items = useFFmpegStore(state => state.items)
	const selectedExts = useRef<Record<number, string>>({})

	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th ta="center">Apply To All</Table.Th>
					<Table.Th>File Name</Table.Th>
					<Table.Th ta="center">Size</Table.Th>
					<Table.Th ta="center">New Format</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{items.map((item, index) => {
					const {
						inputFile: { name, size },
						status,
					} = item
					const byte = byteSize(size)
					return (
						<Table.Tr key={name}>
							<Table.Td>
								<Button size="md">Apply</Button>
							</Table.Td>
							<Table.Td>
								<Text truncate="start" ta="end" w="16rem">
									{name}
								</Text>
							</Table.Td>
							<Table.Td>
								<Text truncate>{byte.value + ' ' + byte.unit}</Text>
							</Table.Td>
							<Table.Td>
								<Select
									w="6rem"
									placeholder=".mp4"
									data={exts}
									defaultValue={exts[0]!}
									onChange={v => {
										if (!v) return
										selectedExts.current[index] = v
									}}
								/>
							</Table.Td>
							<Table.Td>
								<Button
									w="6rem"
									color="red"
									{...(status === 'done'
										? {
												component: 'a',
												href: item.outputURL,
											}
										: {})}
									loading={status === 'loading'}
									onClick={() => {
										status === 'done'
											? 1
											: useFFmpegStore.getState().transcode({
													index,
													ext: selectedExts.current[index] || exts[0]!,
												})
									}}
								>
									{status === 'idle'
										? 'Start'
										: status === 'loading'
											? 'Processing'
											: 'done'}
								</Button>
							</Table.Td>
						</Table.Tr>
					)
				})}
			</Table.Tbody>
		</Table>
	)
}
