const cacheName = 'my-site-cache-v1'
const urlsToCache = [
	'/',
	'/index.html',
	'/assets',
	// Add more URLs of your assets to cache as needed
]

self.addEventListener('install', event => {
	// @ts-expect-error ...
	event.waitUntil(
		caches.open(cacheName).then(cache => cache.addAll(urlsToCache))
	)
})

self.addEventListener('fetch', event => {
	// @ts-expect-error ...
	event.respondWith(
		caches
			// @ts-expect-error ...
			.match(event.request)
			// @ts-expect-error ...
			.then(response => response || fetch(event.request))
	)
})

self.addEventListener('activate', event => {
	// @ts-expect-error ...
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cache => {
					if (cache !== cacheName) {
						return caches.delete(cache)
					}
				})
			)
		})
	)
})
