import { Loader } from '@mantine/core'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from './component'
import { Suspense, useEffect } from 'react'
import { useFFmpegStore } from '@/stores'
export const App = () => {
	useEffect(() => {
		useFFmpegStore.getState().load()
	}, [])
	return (
		<>
			<Outlet />
			<Suspense fallback={<Loader />}>
				<TanStackRouterDevtools />
			</Suspense>
		</>
	)
}
