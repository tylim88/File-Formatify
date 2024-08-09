import { Loader } from '@mantine/core'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from './component'
import { Suspense } from 'react'

export const App = () => {
	return (
		<>
			<Outlet />
			<Suspense fallback={<Loader />}>
				<TanStackRouterDevtools />
			</Suspense>
		</>
	)
}
