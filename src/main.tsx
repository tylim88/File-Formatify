import '@mantine/core/styles.css' // https://mantine.dev/styles/mantine-styles/#styles-import-order
import '@mantine/dropzone/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes'
import { isProduction } from './config'
import './main.css'
import { THEME } from './theme'

// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker.register('./sw.js').catch(error => {
// 		console.error('Service Worker registration failed:', error)
// 	})
// }

!isProduction &&
	import('eruda')
		// @ts-expect-error ...
		.then(eruda => eruda.init())
		.catch(({ e }) => {
			console.error({ e })
		})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<HelmetProvider>
			<MantineProvider theme={THEME}>
				<RouterProvider router={router} />
			</MantineProvider>
		</HelmetProvider>
	</React.StrictMode>
)
