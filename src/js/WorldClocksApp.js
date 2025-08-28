// src/js/WorldClocksApp.js - Main application controller
class WorldClocksApp {
	constructor() {
		this.clocks = new Map();
		this.updateInterval = null;
		this.gridManager = new GridManager('#clocks-container');
		this.eventManager = new EventManager();
		this.lastUpdatedElement = document.getElementById('last-updated');

		this.init();
	}

	init() {
		this.loadCitiesFromConfig();
		this.startClock();
		this.setupEventListeners();

		// Initial update
		this.updateAllClocks();
	}

	loadCitiesFromConfig() {
		// Check if WORLD_CITIES is available
		if (typeof WORLD_CITIES === 'undefined') {
			console.error('WORLD_CITIES not found. Make sure cities.js is loaded before script.js');
			return;
		}

		// Sort cities by UTC offset before loading
		const sortedCities = TimeZoneUtils.sortCitiesByUTCOffset([...WORLD_CITIES]);

		// Load all cities from configuration in UTC offset order
		sortedCities.forEach(city => {
			this.addCity(city.timezone, city.city, city.country, city.flag);
		});

		console.log(`Loaded ${sortedCities.length} cities from configuration (sorted by UTC offset)`);
	}

	addCity(timezone, city, country, flag) {
		// Create new clock instance
		const clock = new WorldClock(timezone, city, country, flag);
		const clockElement = clock.createElement();

		// Set up event listeners for the clock card
		this.eventManager.setupClockCardListeners(clockElement, () => {
			this.onClockClick(clock);
		});

		// Add to grid
		this.gridManager.addCard(clockElement);

		// Store clock instance
		this.clocks.set(city, clock);

		// Update the new clock immediately
		clock.updateTime(new Date());

		console.log(`Added timezone: ${city}, ${country}`);
		return clock;
	}

	removeCity(cityName) {
		const clock = this.clocks.get(cityName);
		if (!clock) {
			console.warn(`City not found: ${cityName}`);
			return false;
		}

		// Remove from grid
		this.gridManager.removeCard(clock.element);

		// Remove from clocks map
		this.clocks.delete(cityName);

		console.log(`Removed timezone: ${cityName}`);
		return true;
	}

	updateAllClocks() {
		const now = new Date();

		// Update all clock instances
		this.clocks.forEach(clock => {
			clock.updateTime(now);
		});

		// Update last updated time
		this.updateLastUpdatedTime(now);
	}

	updateLastUpdatedTime(now) {
		if (this.lastUpdatedElement) {
			const timeString = now.toLocaleTimeString('en-US', {
				hour12: true,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			});
			this.lastUpdatedElement.textContent = timeString;
		}
	}

	startClock() {
		// Update every second, but only when visible
		this.updateInterval = setInterval(() => {
			if (this.eventManager.isVisible) {
				this.updateAllClocks();
			}
		}, 1000);
	}

	stopClock() {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}
	}

	setupEventListeners() {
		// Handle visibility changes for performance
		this.eventManager.on('tabVisible', () => {
			this.updateAllClocks(); // Update immediately when tab becomes visible
		});

		this.eventManager.on('windowFocus', () => {
			this.updateAllClocks();
		});

		this.eventManager.on('connectionRestored', () => {
			this.updateAllClocks();
		});

		this.eventManager.on('pageLoad', () => {
			this.updateAllClocks();
		});
	}

	onClockClick(clock) {
		// Future: Could implement features like:
		// - Show more detailed time information
		// - Set reminders for this timezone
		// - Show world map with location
		// - Add to favorites

		console.log(`Clicked on ${clock.city} clock`);

		// Add a small animation feedback
		clock.element.style.transform = 'scale(0.98)';
		setTimeout(() => {
			clock.element.style.transform = '';
		}, 150);
	}

	// Public API methods
	addMultipleCities(cities) {
		cities.forEach(city => {
			this.addCity(city.timezone, city.city, city.country, city.flag);
		});
	}

	getAllCities() {
		return Array.from(this.clocks.values()).map(clock => ({
			timezone: clock.timezone,
			city: clock.city,
			country: clock.country,
			flag: clock.flag,
		}));
	}

	findCity(cityName) {
		for (const [name, clock] of this.clocks) {
			if (name.toLowerCase().includes(cityName.toLowerCase())) {
				return clock;
			}
		}
		return null;
	}

	sortAllCitiesByUTCOffset() {
		// Get current cities data
		const currentCities = this.getAllCities();

		// Clear current display
		this.clocks.forEach(clock => this.gridManager.removeCard(clock.element));
		this.clocks.clear();

		// Sort and re-add cities
		const sortedCities = TimeZoneUtils.sortCitiesByUTCOffset(currentCities);
		sortedCities.forEach(city => {
			this.addCity(city.timezone, city.city, city.country, city.flag);
		});

		console.log('Cities resorted by UTC offset');
	}

	clearAllCities() {
		this.clocks.clear();
		this.gridManager.clearAllCards();
		console.log('All cities cleared');
	}

	// Cleanup method
	destroy() {
		this.stopClock();
		this.eventManager.destroy();

		// Destroy individual clocks
		this.clocks.forEach(clock => {
			if (clock.destroy) {
				clock.destroy();
			}
		});

		this.clocks.clear();
		console.log('WorldClocksApp instance destroyed');
	}
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
	module.exports = WorldClocksApp;
}
