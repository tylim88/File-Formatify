import { Flex, ActionIcon, rem } from '@mantine/core'
import { IconBrandGithub } from '@tabler/icons-react'

const size = rem(24)
const style = { width: size, height: size }

export function FooterSocial() {
	return (
		<Flex gap={0} justify="center" py="xl">
			<ActionIcon
				size="lg"
				color="white"
				variant="subtle"
				component="a"
				href="https://github.com/tylim88/File-Formatify"
				target="_blank"
			>
				<IconBrandGithub style={style} stroke={1.5} />
			</ActionIcon>
		</Flex>
	)
}
