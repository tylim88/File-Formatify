import { Modal, Grid, Stack, Flex, Button, Textarea, Text } from '@mantine/core'
import { useState } from 'react'
import { IconX, IconMail } from '@tabler/icons-react'
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
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const [success, setSuccess] = useState(false)
	return (
		<Modal
			title="Feedback"
			opened={isOpened}
			onClose={close}
			centered
			size="sm"
		>
			<Stack>
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
				{success ? (
					<Flex justify="center" h="1rem">
						<Text size="md" c="green">
							Sent!
						</Text>
					</Flex>
				) : (
					<>
						<Flex justify="center" h="1rem">
							<Text size="sm" c="red">
								{error ? 'something is wrong.' : ''}
							</Text>
						</Flex>
						<Flex justify="space-evenly">
							<Button
								disabled={!subject || !message}
								loading={loading}
								leftSection={<IconMail size={14} />}
								variant="default"
								onClick={async () => {
									setLoading(true)
									setError(false)
									await axios
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
											setSuccess(true)

											setTimeout(() => {
												close()
											}, 1000)

											setTimeout(() => {
												setSuccess(false)
											}, 2000)
										})
										.catch(error => {
											setError(true)
											console.error('Error sending data:', error)
										})
									setLoading(false)
								}}
							>
								Send
							</Button>
							<Button
								leftSection={<IconX size={14} />}
								variant="default"
								onClick={() => {
									setError(false)
									close()
								}}
							>
								Cancel
							</Button>
						</Flex>
					</>
				)}
			</Stack>
		</Modal>
	)
}
