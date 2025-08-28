/**
 * PWA Manager - Handles Progressive Web App functionality
 */
class PWAManager {
	constructor() {
		this.deferredPrompt = null;
		this.isInstalled = false;
		this.swRegistration = null;

		this.init();
	}

	async init() {
		try {
			await this.registerServiceWorker();
			this.setupInstallPrompt();
			this.checkIfInstalled();
			this.setupNotifications();
			console.log('[PWA] PWA Manager initialized successfully');
		} catch (error) {
			console.error('[PWA] Failed to initialize PWA Manager:', error);
		}
	}

	async registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			try {
				console.log('[PWA] Registering service worker...');
				this.swRegistration = await navigator.serviceWorker.register('./sw.js');

				console.log('[PWA] Service worker registered successfully');

				// Handle service worker updates
				this.swRegistration.addEventListener('updatefound', () => {
					const newWorker = this.swRegistration.installing;

					if (newWorker) {
						newWorker.addEventListener('statechange', () => {
							if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
								console.log('[PWA] New service worker available');
								this.showUpdateAvailable();
							}
						});
					}
				});

				// Listen for controlling service worker changes
				navigator.serviceWorker.addEventListener('controllerchange', () => {
					console.log('[PWA] Service worker controller changed - reloading page');
					window.location.reload();
				});
			} catch (error) {
				console.error('[PWA] Service worker registration failed:', error);
			}
		} else {
			console.warn('[PWA] Service workers are not supported');
		}
	}

	setupInstallPrompt() {
		// Listen for the beforeinstallprompt event
		window.addEventListener('beforeinstallprompt', event => {
			console.log('[PWA] Before install prompt triggered');

			// Prevent the mini-infobar from appearing on mobile
			event.preventDefault();

			// Save the event for later use
			this.deferredPrompt = event;

			// Show custom install button/prompt
			this.showInstallPrompt();
		});

		// Listen for the app being installed
		window.addEventListener('appinstalled', event => {
			console.log('[PWA] App was successfully installed');
			this.isInstalled = true;
			this.hideInstallPrompt();
			this.trackInstallation();
		});
	}

	showInstallPrompt() {
		// Create install prompt UI
		const installPrompt = document.createElement('div');
		installPrompt.id = 'pwa-install-prompt';
		installPrompt.className =
			'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-full';

		installPrompt.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-download mr-3 text-xl"></i>
          <div>
            <div class="font-semibold">Install World Clocks</div>
            <div class="text-sm opacity-90">Add to your home screen for quick access</div>
          </div>
        </div>
        <div class="flex ml-4">
          <button id="pwa-install-btn" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium mr-2 hover:bg-blue-50">
            Install
          </button>
          <button id="pwa-dismiss-btn" class="text-white hover:text-blue-200">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;

		document.body.appendChild(installPrompt);

		// Animate in
		setTimeout(() => {
			installPrompt.classList.remove('translate-y-full');
		}, 100);

		// Handle install button click
		document.getElementById('pwa-install-btn').addEventListener('click', () => {
			this.installApp();
		});

		// Handle dismiss button click
		document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
			this.hideInstallPrompt();
		});
	}

	hideInstallPrompt() {
		const prompt = document.getElementById('pwa-install-prompt');
		if (prompt) {
			prompt.classList.add('translate-y-full');
			setTimeout(() => {
				prompt.remove();
			}, 300);
		}
	}

	async installApp() {
		if (!this.deferredPrompt) {
			console.warn('[PWA] No deferred prompt available');
			return;
		}

		try {
			// Show the install prompt
			this.deferredPrompt.prompt();

			// Wait for the user to respond to the prompt
			const { outcome } = await this.deferredPrompt.userChoice;

			console.log(`[PWA] User response to install prompt: ${outcome}`);

			if (outcome === 'accepted') {
				console.log('[PWA] User accepted the install prompt');
			} else {
				console.log('[PWA] User dismissed the install prompt');
			}

			// Clear the deferred prompt
			this.deferredPrompt = null;
			this.hideInstallPrompt();
		} catch (error) {
			console.error('[PWA] Error during app installation:', error);
		}
	}

	checkIfInstalled() {
		// Check if app is running in standalone mode (installed as PWA)
		if (window.matchMedia('(display-mode: standalone)').matches) {
			console.log('[PWA] App is running in standalone mode (installed)');
			this.isInstalled = true;
			document.body.classList.add('pwa-installed');
		}

		// Also check for iOS Safari standalone mode
		if (window.navigator.standalone === true) {
			console.log('[PWA] App is running in iOS standalone mode (installed)');
			this.isInstalled = true;
			document.body.classList.add('pwa-installed');
		}
	}

	setupNotifications() {
		// Check if notifications are supported
		if ('Notification' in window) {
			console.log('[PWA] Notifications are supported');

			// Check current permission status
			if (Notification.permission === 'default') {
				console.log('[PWA] Notification permission not yet granted');
			} else if (Notification.permission === 'granted') {
				console.log('[PWA] Notification permission granted');
			} else {
				console.log('[PWA] Notification permission denied');
			}
		} else {
			console.warn('[PWA] Notifications are not supported');
		}
	}

	async requestNotificationPermission() {
		if ('Notification' in window && Notification.permission === 'default') {
			try {
				const permission = await Notification.requestPermission();
				console.log(`[PWA] Notification permission: ${permission}`);
				return permission === 'granted';
			} catch (error) {
				console.error('[PWA] Error requesting notification permission:', error);
				return false;
			}
		}
		return Notification.permission === 'granted';
	}

	showUpdateAvailable() {
		// Create update notification
		const updatePrompt = document.createElement('div');
		updatePrompt.id = 'pwa-update-prompt';
		updatePrompt.className =
			'fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50';

		updatePrompt.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-sync-alt mr-3 text-xl"></i>
          <div>
            <div class="font-semibold">Update Available</div>
            <div class="text-sm opacity-90">A new version is ready</div>
          </div>
        </div>
        <div class="flex ml-4">
          <button id="pwa-update-btn" class="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium mr-2 hover:bg-green-50">
            Update
          </button>
          <button id="pwa-update-dismiss-btn" class="text-white hover:text-green-200">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;

		document.body.appendChild(updatePrompt);

		// Handle update button click
		document.getElementById('pwa-update-btn').addEventListener('click', () => {
			this.updateApp();
		});

		// Handle dismiss button click
		document.getElementById('pwa-update-dismiss-btn').addEventListener('click', () => {
			updatePrompt.remove();
		});
	}

	updateApp() {
		if (this.swRegistration && this.swRegistration.waiting) {
			// Tell the waiting service worker to skip waiting
			this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
		}
	}

	trackInstallation() {
		// Track installation for analytics (if you have analytics setup)
		console.log('[PWA] App installation tracked');

		// You can add analytics tracking here
		// gtag('event', 'pwa_install', { event_category: 'PWA' });
	}

	// Public methods for app to use
	getInstallationStatus() {
		return {
			isInstalled: this.isInstalled,
			canInstall: !!this.deferredPrompt,
			serviceWorkerReady: !!this.swRegistration,
		};
	}

	async getServiceWorkerVersion() {
		if (this.swRegistration) {
			return new Promise(resolve => {
				const messageChannel = new MessageChannel();
				messageChannel.port1.onmessage = event => {
					resolve(event.data.version);
				};

				this.swRegistration.active.postMessage({ type: 'GET_VERSION' }, [messageChannel.port2]);
			});
		}
		return null;
	}
}

// Export for use in main app
window.PWAManager = PWAManager;
