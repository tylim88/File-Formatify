import { Stack, Center, Loader } from '@mantine/core'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from './component'
import { Suspense } from 'react'
import { THEME } from './theme'

export const App = () => {
	return (
		<Stack w="100%" maw={9999} h="100%" gap="lg" align="center">
			<Center
				maw={THEME.breakpoints.xl}
				px="xl"
				h="100%"
				w="100%"
				style={{
					flex: '1 1 auto',
					overflow: 'auto',
				}}
			>
				<Outlet />
			</Center>
			<Suspense fallback={<Loader />}>
				<TanStackRouterDevtools />
			</Suspense>
		</Stack>
	)
}
