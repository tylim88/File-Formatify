import { Container, Group, ActionIcon, rem } from '@mantine/core'
import { IconBrandGithub } from '@tabler/icons-react'
import classes from './FooterSocial.module.css'
import Logo from '../../assets/logo.svg'

export function FooterSocial() {
	return (
		<div className={classes.footer}>
			<Container className={classes.inner}>
				<Logo />
				<Group
					gap={0}
					className={classes.links}
					justify="flex-end"
					wrap="nowrap"
				>
					<ActionIcon
						size="lg"
						color="gray"
						variant="subtle"
						component="a"
						href="https://github.com/tylim88/File-Formatify"
						target="_blank"
					>
						<IconBrandGithub
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
						/>
					</ActionIcon>
				</Group>
			</Container>
		</div>
	)
}
