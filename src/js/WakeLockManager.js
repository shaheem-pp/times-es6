/**
 * Wake Lock Manager - Prevents screen from sleeping while app is active
 */
class WakeLockManager {
	constructor() {
		this.wakeLock = null;
		this.isSupported = 'wakeLock' in navigator;
		this.isActive = false;

		this.init();
	}

	init() {
		if (!this.isSupported) {
			console.warn('[Wake Lock] Wake Lock API not supported in this browser');
			return;
		}

		console.log('[Wake Lock] Wake Lock API supported');

		// Listen for page visibility changes
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible' && this.isActive) {
				this.requestWakeLock();
			}
		});

		// Auto-enable wake lock for clock apps
		this.enableWakeLock();
	}

	async requestWakeLock() {
		if (!this.isSupported) {
			console.warn('[Wake Lock] Wake Lock API not supported');
			return false;
		}

		try {
			// Release existing wake lock first
			if (this.wakeLock) {
				await this.wakeLock.release();
			}

			// Request a new wake lock
			this.wakeLock = await navigator.wakeLock.request('screen');
			console.log('[Wake Lock] Screen wake lock acquired');

			// Listen for wake lock release
			this.wakeLock.addEventListener('release', () => {
				console.log('[Wake Lock] Screen wake lock released');
			});

			return true;
		} catch (error) {
			console.error('[Wake Lock] Failed to acquire wake lock:', error);
			return false;
		}
	}

	async releaseWakeLock() {
		if (this.wakeLock) {
			try {
				await this.wakeLock.release();
				this.wakeLock = null;
				console.log('[Wake Lock] Screen wake lock manually released');
				return true;
			} catch (error) {
				console.error('[Wake Lock] Failed to release wake lock:', error);
				return false;
			}
		}
		return true;
	}

	async enableWakeLock() {
		this.isActive = true;
		const success = await this.requestWakeLock();

		if (success) {
			this.showWakeLockStatus(true);
		}

		return success;
	}

	async disableWakeLock() {
		this.isActive = false;
		const success = await this.releaseWakeLock();

		if (success) {
			this.showWakeLockStatus(false);
		}

		return success;
	}

	toggleWakeLock() {
		if (this.isActive) {
			return this.disableWakeLock();
		} else {
			return this.enableWakeLock();
		}
	}

	showWakeLockStatus(isEnabled) {
		// Remove existing status if any
		const existingStatus = document.getElementById('wake-lock-status');
		if (existingStatus) {
			existingStatus.remove();
		}

		// Create status notification
		const statusDiv = document.createElement('div');
		statusDiv.id = 'wake-lock-status';
		statusDiv.className = `fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 p-3 rounded-lg shadow-lg z-40 transform transition-all duration-300 ${
			isEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
		}`;

		statusDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas ${isEnabled ? 'fa-eye' : 'fa-eye-slash'} mr-2"></i>
          <span class="text-sm font-medium">
            Screen ${isEnabled ? 'Stay Awake: ON' : 'Stay Awake: OFF'}
          </span>
        </div>
        <button class="text-white hover:text-gray-200 ml-2" onclick="window.wakeLockManager.toggleWakeLock()">
          <i class="fas ${isEnabled ? 'fa-toggle-on' : 'fa-toggle-off'} text-lg"></i>
        </button>
      </div>
    `;

		document.body.appendChild(statusDiv);

		// Auto-hide after 3 seconds
		setTimeout(() => {
			if (statusDiv && statusDiv.parentNode) {
				statusDiv.style.transform = 'translateY(100%)';
				setTimeout(() => {
					if (statusDiv && statusDiv.parentNode) {
						statusDiv.remove();
					}
				}, 300);
			}
		}, 3000);
	}

	createWakeLockToggle() {
		// Add wake lock toggle to the header
		const header = document.querySelector('header');
		if (!header) return;

		const toggleButton = document.createElement('button');
		toggleButton.id = 'wake-lock-toggle';
		toggleButton.className =
			'absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm';
		toggleButton.title = 'Toggle screen sleep prevention';

		toggleButton.innerHTML = `
      <i class="fas ${this.isActive ? 'fa-eye' : 'fa-eye-slash'} text-sm"></i>
    `;

		toggleButton.addEventListener('click', async () => {
			await this.toggleWakeLock();

			// Update button icon
			const icon = toggleButton.querySelector('i');
			icon.className = `fas ${this.isActive ? 'fa-eye' : 'fa-eye-slash'} text-sm`;
		});

		header.style.position = 'relative';
		header.appendChild(toggleButton);
	}

	// Public methods for external use
	getStatus() {
		return {
			isSupported: this.isSupported,
			isActive: this.isActive,
			hasWakeLock: !!this.wakeLock,
		};
	}

	// Check if wake lock is currently active
	isWakeLockActive() {
		return this.isActive && !!this.wakeLock;
	}
}

// Export for use in main app
window.WakeLockManager = WakeLockManager;
