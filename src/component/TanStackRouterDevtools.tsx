import { lazy } from 'react'
import { isProduction } from '@/config'

export const TanStackRouterDevtools = isProduction
	? () => null
	: lazy(() =>
			import('@tanstack/router-devtools').then(res => ({
				default: res.TanStackRouterDevtools,
			}))
		)
