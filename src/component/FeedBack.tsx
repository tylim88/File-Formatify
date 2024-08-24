import {
	Modal,
	Grid,
	Stack,
	Flex,
	Button,
	Textarea,
	Text,
	Divider,
} from '@mantine/core'
import { useState } from 'react'
import { IconX, IconMail, IconBrandGithub } from '@tabler/icons-react'
import axios from 'axios'
import { feedbackURL } from '@/config'

export const FeedBack = ({
	isOpened,
	close,
}: {
	isOpened: boolean
	close: () => void
}) => {
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'error' | 'success'
	>('idle')
	return (
		<Modal
			title="Feedback"
			opened={isOpened}
			onClose={() => {
				close()
				setStatus('idle')
			}}
			centered
			size="sm"
		>
			<Stack gap="xs">
				<Grid>
					<Grid.Col span={12}>
						<Textarea
							ta="left"
							label="Subject"
							value={subject}
							onChange={event => setSubject(event.currentTarget.value)}
							required
							styles={{
								input: {
									maxHeight: '1rem',
								},
								label: { fontWeight: 'bold' },
							}}
						/>
					</Grid.Col>
					<Grid.Col span={12}>
						<Textarea
							ta="left"
							label="Message"
							value={message}
							onChange={event => setMessage(event.currentTarget.value)}
							required
							styles={{
								input: {
									minHeight: '5rem',
								},
								label: { fontWeight: 'bold' },
							}}
							resize="vertical"
						/>
					</Grid.Col>
				</Grid>
				{status === 'success' ? (
					<Flex justify="center" h="1rem">
						<Text size="md" c="green">
							Sent!
						</Text>
					</Flex>
				) : (
					<>
						<Flex justify="center" h="1rem">
							<Text size="sm" c="red">
								{status === 'error' ? 'something is wrong.' : ''}
							</Text>
						</Flex>
						<Flex justify="space-evenly">
							<Button
								disabled={!subject || !message}
								loading={status === 'loading'}
								leftSection={<IconMail size={14} />}
								variant="default"
								onClick={() => {
									setStatus('loading')
									axios
										.post(
											feedbackURL,
											{
												subject,
												message,
											},
											{
												headers: {
													'Content-Type': 'application/json',
												},
											}
										)
										.then(() => {
											setStatus('success')
											setTimeout(() => {
												close()
											}, 1000)
											setTimeout(() => {
												setStatus('idle')
											}, 2000)
										})
										.catch(error => {
											setStatus('error')
											console.error('Error sending data:', error)
										})
								}}
							>
								Send
							</Button>
							<Button
								leftSection={<IconX size={14} />}
								variant="default"
								onClick={close}
							>
								Cancel
							</Button>
						</Flex>
						<Divider my="xs" label="or" labelPosition="center" />
						<Flex justify="center">
							<Button
								component="a"
								href="https://github.com/tylim88/FileJedi/issues/new/choose"
								target="_blank"
								bg="black"
								leftSection={<IconBrandGithub size={14} />}
								variant="filled"
							>
								Issue
							</Button>
						</Flex>
					</>
				)}
			</Stack>
		</Modal>
	)
}
