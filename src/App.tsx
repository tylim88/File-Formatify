import { Stack, Loader } from '@mantine/core'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from './component'
import { Suspense } from 'react'

export const App = () => {
	return (
		<Stack w="100%" maw={9999} h="100%" gap="lg" align="center">
			<Outlet />
			<Suspense fallback={<Loader />}>
				<TanStackRouterDevtools />
			</Suspense>
		</Stack>
	)
}
