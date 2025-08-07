// World Clocks JavaScript
// Cities are now configured in cities.js

class WorldClocks {
  constructor() {
    this.clockElements = [];
    this.updateInterval = null;
    this.isVisible = true;

    this.init();
  }

  init() {
    this.loadCitiesFromConfig();
    this.updateGridLayout();
    this.startClock();
    this.setupVisibilityChange();
    this.setupEventListeners();

    // Initial update
    this.updateAllClocks();
  }

  updateGridLayout() {
    const gridContainer = document.querySelector(".flex-1.grid");
    if (gridContainer) {
      const cardCount = this.clockElements.length;
      gridContainer.setAttribute("data-card-count", cardCount);
      console.log(`Updated grid for ${cardCount} cards`);
    }
  }

  loadCitiesFromConfig() {
    // Check if WORLD_CITIES is available
    if (typeof WORLD_CITIES === "undefined") {
      console.error(
        "WORLD_CITIES not found. Make sure cities.js is loaded before script.js"
      );
      return;
    }

    // Sort cities by UTC offset before loading
    const sortedCities = this.sortCitiesByUTCOffset([...WORLD_CITIES]);

    // Load all cities from configuration in UTC offset order
    sortedCities.forEach((city) => {
      this.addTimezone(city.timezone, city.city, city.country, city.flag);
    });

    console.log(
      `Loaded ${sortedCities.length} cities from configuration (sorted by UTC offset)`
    );
  }

  sortCitiesByUTCOffset(cities) {
    const now = new Date();

    // Get UTC offset for each city and sort
    const citiesWithOffset = cities.map((city) => {
      const offset = this.getUTCOffsetMinutes(now, city.timezone);
      return {
        ...city,
        offsetMinutes: offset,
      };
    });

    // Sort by UTC offset (ascending: UTC-12 to UTC+14)
    citiesWithOffset.sort((a, b) => a.offsetMinutes - b.offsetMinutes);

    // Remove the temporary offsetMinutes property
    return citiesWithOffset.map((city) => {
      const { offsetMinutes, ...cityWithoutOffset } = city;
      return cityWithoutOffset;
    });
  }

  getUTCOffsetMinutes(date, timezone) {
    try {
      // Get the time in UTC and in the specific timezone
      const utcTime = new Date(
        date.toLocaleString("en-US", { timeZone: "UTC" })
      );
      const localTime = new Date(
        date.toLocaleString("en-US", { timeZone: timezone })
      );

      // Calculate the difference in minutes
      const offsetMinutes = Math.round(
        (localTime.getTime() - utcTime.getTime()) / 60000
      );

      return offsetMinutes;
    } catch (error) {
      console.warn(`Could not get UTC offset for ${timezone}:`, error);
      return 0; // Default to UTC if there's an error
    }
  }

  updateAllClocks() {
    const now = new Date();

    this.clockElements.forEach((clock) => {
      this.updateSingleClock(clock, now);
    });

    // Update last updated time
    this.updateLastUpdatedTime(now);
  }

  updateSingleClock(clock, now) {
    try {
      // Get time in specific timezone
      const timeOptions = {
        timeZone: clock.timezone,
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const timeString = now.toLocaleTimeString("en-US", timeOptions);
      const [time, period] = timeString.split(" ");

      // Get date in specific timezone
      const dateOptions = {
        timeZone: clock.timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const dateString = now.toLocaleDateString("en-US", dateOptions);

      // Get timezone offset
      const offset = this.getTimezoneOffset(now, clock.timezone);

      // Update DOM elements
      if (clock.timeElement) {
        clock.timeElement.textContent = time;
        clock.timeElement.classList.remove("loading");
      }

      if (clock.periodElement) {
        clock.periodElement.textContent = period;
      }

      if (clock.dateElement) {
        clock.dateElement.textContent = dateString;
        clock.dateElement.classList.remove("loading");
      }

      if (clock.offsetElement) {
        clock.offsetElement.textContent = `UTC ${offset}`;
      }

      // Add day/night indicator
      this.updateDayNightIndicator(clock, now);
    } catch (error) {
      console.error(`Error updating clock for ${clock.city}:`, error);
      this.showError(clock);
    }
  }

  getTimezoneOffset(date, timezone) {
    try {
      // Use Intl.DateTimeFormat to get accurate timezone offset
      const formatter = new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        timeZoneName: "longOffset",
      });

      const parts = formatter.formatToParts(date);
      const timeZoneName = parts.find((part) => part.type === "timeZoneName");

      if (timeZoneName && timeZoneName.value !== timezone) {
        // Extract the offset from the formatted result (e.g., "GMT+09:00")
        const offsetMatch = timeZoneName.value.match(
          /GMT([+-])(\d{1,2}):?(\d{2})?/
        );
        if (offsetMatch) {
          const sign = offsetMatch[1];
          const hours = offsetMatch[2].padStart(2, "0");
          const minutes = offsetMatch[3] || "00";
          return `${sign}${hours}:${minutes}`;
        }
      }

      // Fallback method with proper rounding
      const utcDate = new Date(
        date.toLocaleString("en-US", { timeZone: "UTC" })
      );
      const localDate = new Date(
        date.toLocaleString("en-US", { timeZone: timezone })
      );
      const offsetMinutes = Math.round(
        (localDate.getTime() - utcDate.getTime()) / 60000
      );

      const hours = Math.floor(Math.abs(offsetMinutes) / 60);
      const minutes = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes >= 0 ? "+" : "-";

      return `${sign}${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    } catch (error) {
      return "--:--";
    }
  }

  updateDayNightIndicator(clock, now) {
    try {
      const hour = parseInt(
        now.toLocaleTimeString("en-US", {
          timeZone: clock.timezone,
          hour12: false,
          hour: "2-digit",
        })
      );

      const isNight = hour < 6 || hour >= 18;

      if (isNight) {
        clock.element.classList.add("night-time");
        clock.element.classList.remove("day-time");
      } else {
        clock.element.classList.add("day-time");
        clock.element.classList.remove("night-time");
      }
    } catch (error) {
      console.error(
        `Error updating day/night indicator for ${clock.city}:`,
        error
      );
    }
  }

  showError(clock) {
    if (clock.timeElement) {
      clock.timeElement.textContent = "Error";
      clock.timeElement.classList.add("error");
    }
    if (clock.dateElement) {
      clock.dateElement.textContent = "Unable to load time";
      clock.dateElement.classList.add("error");
    }
  }

  updateLastUpdatedTime(now) {
    const lastUpdatedElement = document.getElementById("last-updated");
    if (lastUpdatedElement) {
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      lastUpdatedElement.textContent = timeString;
    }
  }

  startClock() {
    // Update every second
    this.updateInterval = setInterval(() => {
      if (this.isVisible) {
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

  setupVisibilityChange() {
    // Pause updates when tab is not visible to save resources
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
        this.updateAllClocks(); // Update immediately when tab becomes visible
      }
    });

    // Handle window focus/blur
    window.addEventListener("focus", () => {
      this.isVisible = true;
      this.updateAllClocks();
    });

    window.addEventListener("blur", () => {
      this.isVisible = false;
    });
  }

  setupEventListeners() {
    // Add click handlers to clock cards for potential future features
    this.clockElements.forEach((clock) => {
      clock.element.addEventListener("click", () => {
        this.onClockClick(clock);
      });

      // Add keyboard accessibility
      clock.element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.onClockClick(clock);
        }
      });

      // Make clock cards focusable
      clock.element.setAttribute("tabindex", "0");
      clock.element.setAttribute("role", "button");
      clock.element.setAttribute(
        "aria-label",
        `View time for ${clock.city}, ${clock.country}`
      );
    });

    // Handle page load
    window.addEventListener("load", () => {
      this.updateAllClocks();
    });

    // Handle online/offline status
    window.addEventListener("online", () => {
      console.log("Connection restored");
      this.updateAllClocks();
    });

    window.addEventListener("offline", () => {
      console.log("Connection lost");
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
    clock.element.style.transform = "scale(0.98)";
    setTimeout(() => {
      clock.element.style.transform = "";
    }, 150);
  }

  // Method to add new timezone dynamically
  addTimezone(timezone, city, country, flag) {
    const clocksContainer = document.querySelector("#clocks-container");

    // Create new clock card element
    const clockCard = document.createElement("div");
    clockCard.className = "clock-card";
    clockCard.setAttribute("data-timezone", timezone);
    clockCard.setAttribute("data-city", city);
    clockCard.setAttribute("data-country", country);
    clockCard.setAttribute("data-icon", flag);
    clockCard.setAttribute("tabindex", "0");
    clockCard.setAttribute("role", "button");
    clockCard.setAttribute("aria-label", `View time for ${city}, ${country}`);

    clockCard.innerHTML = `
          <div class="clock-content">
            <div class="location-info">
              <span class="flag">${flag}</span>
              <div class="location-text">
                <h2 class="city">${city}</h2>
                <p class="country">${country}</p>
              </div>
            </div>
            <div class="time-display">
              <div class="time">--:--:--</div>
              <div class="period">--</div>
            </div>
            <div class="date">Loading...</div>
            <div class="timezone-offset">UTC --:--</div>
          </div>
        `;

    // Add to DOM
    clocksContainer.appendChild(clockCard);

    // Create clock element object
    const clockElement = {
      element: clockCard,
      timezone: timezone,
      city: city,
      country: country,
      timeElement: clockCard.querySelector(".time"),
      periodElement: clockCard.querySelector(".period"),
      dateElement: clockCard.querySelector(".date"),
      offsetElement: clockCard.querySelector(".timezone-offset"),
    };

    // Add to clockElements array
    this.clockElements.push(clockElement);

    // Set up event listeners for the new card
    clockCard.addEventListener("click", () => {
      this.onClockClick(clockElement);
    });

    clockCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.onClockClick(clockElement);
      }
    });

    // Update the new clock immediately
    this.updateSingleClock(clockElement, new Date());

    // Update grid layout
    this.updateGridLayout();

    console.log(`Added timezone: ${city}, ${country}`);
    return clockElement;
  }

  // Method to remove timezone dynamically
  removeTimezone(city) {
    const index = this.clockElements.findIndex((clock) => clock.city === city);

    if (index !== -1) {
      // Remove from DOM
      this.clockElements[index].element.remove();

      // Remove from clockElements array
      this.clockElements.splice(index, 1);

      // Update grid layout
      this.updateGridLayout();

      console.log(`Removed timezone: ${city}`);
      return true;
    }

    console.warn(`Timezone not found: ${city}`);
    return false;
  }

  // Bulk add multiple timezones
  addMultipleTimezones(cities) {
    cities.forEach((city) => {
      this.addTimezone(city.timezone, city.city, city.country, city.flag);
    });
  }

  // Get all current cities
  getAllCities() {
    return this.clockElements.map((clock) => ({
      timezone: clock.timezone,
      city: clock.city,
      country: clock.country,
      element: clock.element,
    }));
  }

  // Find a city by name
  findCity(cityName) {
    return this.clockElements.find((clock) =>
      clock.city.toLowerCase().includes(cityName.toLowerCase())
    );
  }

  // Clear all dynamic cities (keeps original HTML cities)
  clearDynamicCities() {
    const originalCities = document.querySelectorAll(".clock-card");
    const originalCount = originalCities.length;

    // Remove cities that were added dynamically
    const citiesToRemove = this.clockElements.slice(originalCount);
    citiesToRemove.forEach((clock) => {
      clock.element.remove();
    });

    // Update clockElements array
    this.clockElements = this.clockElements.slice(0, originalCount);

    console.log(`Cleared ${citiesToRemove.length} dynamic cities`);
  }

  // Sort all current cities by UTC offset
  sortAllCitiesByUTCOffset() {
    // Get current cities data
    const currentCities = this.clockElements.map((clock) => ({
      timezone: clock.timezone,
      city: clock.city,
      country: clock.country,
      flag: clock.element.querySelector(".flag").textContent,
    }));

    // Clear current display
    this.clockElements.forEach((clock) => clock.element.remove());
    this.clockElements = [];

    // Sort and re-add cities
    const sortedCities = this.sortCitiesByUTCOffset(currentCities);
    sortedCities.forEach((city) => {
      this.addTimezone(city.timezone, city.city, city.country, city.flag);
    });

    console.log("Cities resorted by UTC offset");
  }

  // Cleanup method
  destroy() {
    this.stopClock();

    // Remove event listeners
    this.clockElements.forEach((clock) => {
      clock.element.removeEventListener("click", this.onClockClick);
    });

    console.log("WorldClocks instance destroyed");
  }
}

// Utility functions
const Utils = {
  // Format timezone offset for display
  formatOffset(offsetMinutes) {
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? "+" : "-";
    return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  },

  // Check if device prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  // Get user's current timezone
  getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  },
};

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("World Clocks App Starting...");

  // Create global instance
  window.worldClocks = new WorldClocks();

  console.log("World Clocks App Started Successfully");
});

// Handle unload to cleanup
window.addEventListener("beforeunload", () => {
  if (window.worldClocks) {
    window.worldClocks.destroy();
  }
});

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { WorldClocks, Utils };
}

/* 
USAGE EXAMPLES:

1. Add a single city dynamically:
   worldClocks.addTimezone('Europe/Paris', 'Paris', 'France', '🇫🇷');

2. Add multiple cities at once:
   worldClocks.addMultipleTimezones([
     { timezone: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
     { timezone: 'Europe/Berlin', city: 'Berlin', country: 'Germany', flag: '🇩🇪' }
   ]);

3. Remove a city:
   worldClocks.removeTimezone('Tokyo');

4. Get all current cities:
   const cities = worldClocks.getAllCities();

5. Find a specific city:
   const paris = worldClocks.findCity('Paris');

6. Clear all dynamically added cities:
   worldClocks.clearDynamicCities();

7. Sort all cities by UTC offset:
   worldClocks.sortAllCitiesByUTCOffset();

8. To permanently add cities, edit the WORLD_CITIES array in cities.js file.

AUTOMATIC FEATURES:
- Cities are automatically sorted by UTC offset on initial load
- Grid automatically adjusts based on screen size and number of cities
- Real-time updates with performance optimizations

The grid automatically adjusts based on screen size:
- Mobile (< 768px): 1 column
- Tablet (768px - 1024px): 2 columns  
- Desktop (1024px - 1280px): 3 columns
- Large screens (> 1280px): 4 columns
- Cards automatically resize to fit more cities as needed!
*/
