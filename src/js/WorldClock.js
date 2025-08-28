// src/js/WorldClock.js - Core clock functionality
class WorldClock {
	constructor(timezone, city, country, flag) {
		this.timezone = timezone;
		this.city = city;
		this.country = country;
		this.flag = flag;
		this.element = null;
		this.timeElement = null;
		this.periodElement = null;
		this.dateElement = null;
		this.offsetElement = null;
		this.lastFullDate = '';
		this.lastShortDate = '';

		// Bind resize handler
		this.handleResize = this.handleResize.bind(this);
	}
	createElement() {
		const clockCard = document.createElement('div');
		clockCard.className = 'clock-card';
		clockCard.setAttribute('data-timezone', this.timezone);
		clockCard.setAttribute('data-city', this.city);
		clockCard.setAttribute('data-country', this.country);
		clockCard.setAttribute('data-icon', this.flag);
		clockCard.setAttribute('tabindex', '0');
		clockCard.setAttribute('role', 'button');
		clockCard.setAttribute('aria-label', `View time for ${this.city}, ${this.country}`);

		clockCard.innerHTML = `
      <div class="clock-content">
        <div class="location-info">
          <span class="flag" role="img" aria-label="${this.country} flag">${this.flag}</span>
          <div class="location-text">
            <h2 class="city">${this.city}</h2>
            <p class="country">${this.country}</p>
          </div>
        </div>
        <div class="time-display">
          <time class="time">--:--:--</time>
          <span class="period">--</span>
        </div>
        <div class="date" role="text" aria-label="Current date">Loading...</div>
        <div class="timezone-offset" role="text" aria-label="UTC offset">UTC --:--</div>
      </div>
    `;

		this.element = clockCard;
		this.timeElement = clockCard.querySelector('.time');
		this.periodElement = clockCard.querySelector('.period');
		this.dateElement = clockCard.querySelector('.date');
		this.offsetElement = clockCard.querySelector('.timezone-offset');

		// Add resize listener for responsive date display
		window.addEventListener('resize', this.handleResize);

		return clockCard;
	}

	updateTime(now) {
		try {
			// Get time in specific timezone
			const timeOptions = {
				timeZone: this.timezone,
				hour12: true,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			};

			const timeString = now.toLocaleTimeString('en-US', timeOptions);
			const [time, period] = timeString.split(' ');

			// Get full date for larger screens
			const fullDateOptions = {
				timeZone: this.timezone,
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			};

			// Get abbreviated date for mobile
			const shortDateOptions = {
				timeZone: this.timezone,
				weekday: 'short',
				month: 'short',
				day: 'numeric',
			};

			const fullDateString = now.toLocaleDateString('en-US', fullDateOptions);
			const shortDateString = now.toLocaleDateString('en-US', shortDateOptions);

			// Store for resize handling
			this.lastFullDate = fullDateString;
			this.lastShortDate = shortDateString; // Get timezone offset
			const offset = TimeZoneUtils.getTimezoneOffset(now, this.timezone);

			// Update DOM elements
			if (this.timeElement) {
				this.timeElement.textContent = time;
				this.timeElement.classList.remove('loading');
			}

			if (this.periodElement) {
				this.periodElement.textContent = period;
			}

			if (this.dateElement) {
				// Use appropriate date format based on screen size
				const isMobile = window.innerWidth <= 480;
				const dateToShow = isMobile ? shortDateString : fullDateString;
				this.dateElement.textContent = dateToShow;
				this.dateElement.setAttribute('data-short-date', shortDateString);
				this.dateElement.setAttribute('data-full-date', fullDateString);
				this.dateElement.classList.remove('loading');
			}
			if (this.offsetElement) {
				this.offsetElement.textContent = `UTC ${offset}`;
			}

			// Add day/night indicator
			this.updateDayNightIndicator(now);
		} catch (error) {
			console.error(`Error updating clock for ${this.city}:`, error);
			this.showError();
		}
	}

	updateDayNightIndicator(now) {
		try {
			const hour = parseInt(
				now.toLocaleTimeString('en-US', {
					timeZone: this.timezone,
					hour12: false,
					hour: '2-digit',
				})
			);

			const isNight = hour < 6 || hour >= 18;

			if (isNight) {
				this.element.classList.add('night-time');
				this.element.classList.remove('day-time');
			} else {
				this.element.classList.add('day-time');
				this.element.classList.remove('night-time');
			}
		} catch (error) {
			console.error(`Error updating day/night indicator for ${this.city}:`, error);
		}
	}

	showError() {
		if (this.timeElement) {
			this.timeElement.textContent = 'Error';
			this.timeElement.classList.add('error');
		}
		if (this.dateElement) {
			this.dateElement.textContent = 'Unable to load time';
			this.dateElement.classList.add('error');
		}
	}

	getUTCOffsetMinutes(date) {
		return TimeZoneUtils.getUTCOffsetMinutes(date, this.timezone);
	}

	handleResize() {
		if (this.dateElement && this.lastFullDate && this.lastShortDate) {
			const isMobile = window.innerWidth <= 480;
			const dateToShow = isMobile ? this.lastShortDate : this.lastFullDate;
			this.dateElement.textContent = dateToShow;
		}
	}

	destroy() {
		// Clean up event listeners
		window.removeEventListener('resize', this.handleResize);
	}
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
	module.exports = WorldClock;
}
