import { Router, Route, RootRoute } from '@tanstack/react-router'
import { App } from './App'
/* <a href="https://www.flaticon.com/free-icons/convert" title="convert icons">Convert icons created by Freepik - Flaticon</a> */
const rootRoute = new RootRoute({
	component: App,
})

const getParentRoute = () => rootRoute

export const homeRoute = new Route({
	path: '/',
	component: () => null,
	getParentRoute,
})

const allRoutes = [homeRoute] as const

export const router = new Router({
	routeTree: rootRoute.addChildren([...allRoutes]),
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export type AllRoutes = typeof allRoutes extends readonly [...(infer P)[]]
	? P
	: never
