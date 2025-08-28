const CACHE_NAME = 'world-clocks-v1.0.0';
const STATIC_CACHE_NAME = 'world-clocks-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'world-clocks-dynamic-v1.0.0';

// Assets to cache for offline use
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/manifest.json',
	'/offline.html',
	'/cities.js',
	'/config/settings.js',
	'/src/js/PWAManager.js',
	'/src/js/TimeZoneUtils.js',
	'/src/js/WorldClock.js',
	'/src/js/GridManager.js',
	'/src/js/EventManager.js',
	'/src/js/WorldClocksApp.js',
	'/src/css/main.css',
	'/src/css/base.css',
	'/src/css/grid.css',
	'/src/css/clock-elements.css',
	'/src/css/animations.css',
	'/src/css/background.css',
	'/src/css/components/clock-card.css',
	'/src/css/components/header.css',
	'/cover.png',
];

// External CDN assets to cache
const CDN_ASSETS = [
	'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css',
	'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
];

// Install event - cache static assets
self.addEventListener('install', event => {
	console.log('[Service Worker] Installing...');

	event.waitUntil(
		(async () => {
			try {
				// Cache static assets
				const staticCache = await caches.open(STATIC_CACHE_NAME);
				console.log('[Service Worker] Caching static assets...');
				await staticCache.addAll(STATIC_ASSETS);

				// Cache CDN assets separately to handle potential failures
				const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
				console.log('[Service Worker] Caching CDN assets...');

				for (const url of CDN_ASSETS) {
					try {
						await dynamicCache.add(url);
					} catch (error) {
						console.warn(`[Service Worker] Failed to cache ${url}:`, error);
					}
				}

				console.log('[Service Worker] Installation complete');
				// Force activation of new service worker
				self.skipWaiting();
			} catch (error) {
				console.error('[Service Worker] Installation failed:', error);
			}
		})()
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
	console.log('[Service Worker] Activating...');

	event.waitUntil(
		(async () => {
			try {
				const cacheNames = await caches.keys();
				const deletePromises = cacheNames
					.filter(cacheName => {
						return (
							cacheName !== STATIC_CACHE_NAME &&
							cacheName !== DYNAMIC_CACHE_NAME &&
							(cacheName.startsWith('world-clocks-') ||
								cacheName.startsWith('world-clocks-static-') ||
								cacheName.startsWith('world-clocks-dynamic-'))
						);
					})
					.map(cacheName => {
						console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
						return caches.delete(cacheName);
					});

				await Promise.all(deletePromises);
				console.log('[Service Worker] Activation complete');

				// Take control of all pages
				return self.clients.claim();
			} catch (error) {
				console.error('[Service Worker] Activation failed:', error);
			}
		})()
	);
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
	// Skip non-GET requests
	if (event.request.method !== 'GET') {
		return;
	}

	// Skip chrome-extension requests
	if (event.request.url.startsWith('chrome-extension://')) {
		return;
	}

	event.respondWith(
		(async () => {
			try {
				// Try to get from cache first
				const cachedResponse = await caches.match(event.request);

				if (cachedResponse) {
					console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
					return cachedResponse;
				}

				// If not in cache, fetch from network
				console.log(`[Service Worker] Fetching from network: ${event.request.url}`);
				const networkResponse = await fetch(event.request);

				// Cache successful responses for future use
				if (networkResponse.status === 200) {
					const responseClone = networkResponse.clone();
					const cache = await caches.open(DYNAMIC_CACHE_NAME);
					await cache.put(event.request, responseClone);
				}

				return networkResponse;
			} catch (error) {
				console.log(`[Service Worker] Network failed for ${event.request.url}, trying cache...`);

				// If network fails, try to serve from cache
				const cachedResponse = await caches.match(event.request);
				if (cachedResponse) {
					return cachedResponse;
				}

				// If it's a navigation request and we can't serve it, show offline page
				if (event.request.mode === 'navigate') {
					const offlineResponse = await caches.match('/offline.html');
					if (offlineResponse) {
						return offlineResponse;
					}

					// Fallback to main page if offline.html is not available
					const indexResponse = await caches.match('/');
					if (indexResponse) {
						return indexResponse;
					}
				}

				// Return a basic offline response
				return new Response(
					JSON.stringify({
						error: 'Network error occurred',
						offline: true,
						timestamp: new Date().toISOString(),
					}),
					{
						status: 503,
						statusText: 'Service Unavailable',
						headers: {
							'Content-Type': 'application/json',
							'Cache-Control': 'no-cache',
						},
					}
				);
			}
		})()
	);
});

// Handle background sync for when connectivity is restored
self.addEventListener('sync', event => {
	console.log('[Service Worker] Background sync triggered:', event.tag);

	if (event.tag === 'background-sync') {
		event.waitUntil(
			// Perform background sync tasks here
			console.log('[Service Worker] Performing background sync...')
		);
	}
});

// Handle push notifications (if needed in the future)
self.addEventListener('push', event => {
	console.log('[Service Worker] Push received:', event);

	const options = {
		body: event.data ? event.data.text() : 'World Clocks update available',
		icon: '/icons/icon-192x192.png',
		badge: '/icons/icon-72x72.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: '1',
		},
		actions: [
			{
				action: 'explore',
				title: 'Open App',
				icon: '/icons/icon-192x192.png',
			},
			{
				action: 'close',
				title: 'Close',
				icon: '/icons/icon-192x192.png',
			},
		],
	};

	event.waitUntil(self.registration.showNotification('World Clocks', options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
	console.log('[Service Worker] Notification click received:', event);

	event.notification.close();

	if (event.action === 'explore') {
		event.waitUntil(clients.openWindow('/'));
	}
});

// Message handler for communication with main app
self.addEventListener('message', event => {
	console.log('[Service Worker] Message received:', event.data);

	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}

	if (event.data && event.data.type === 'GET_VERSION') {
		event.ports[0].postMessage({
			type: 'VERSION',
			version: CACHE_NAME,
		});
	}
});

console.log('[Service Worker] Service Worker script loaded');
