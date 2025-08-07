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
  }

  createElement() {
    const clockCard = document.createElement("div");
    clockCard.className = "clock-card";
    clockCard.setAttribute("data-timezone", this.timezone);
    clockCard.setAttribute("data-city", this.city);
    clockCard.setAttribute("data-country", this.country);
    clockCard.setAttribute("data-icon", this.flag);
    clockCard.setAttribute("tabindex", "0");
    clockCard.setAttribute("role", "button");
    clockCard.setAttribute(
      "aria-label",
      `View time for ${this.city}, ${this.country}`
    );

    clockCard.innerHTML = `
      <div class="clock-content">
        <div class="location-info">
          <span class="flag">${this.flag}</span>
          <div class="location-text">
            <h2 class="city">${this.city}</h2>
            <p class="country">${this.country}</p>
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

    this.element = clockCard;
    this.timeElement = clockCard.querySelector(".time");
    this.periodElement = clockCard.querySelector(".period");
    this.dateElement = clockCard.querySelector(".date");
    this.offsetElement = clockCard.querySelector(".timezone-offset");

    return clockCard;
  }

  updateTime(now) {
    try {
      // Get time in specific timezone
      const timeOptions = {
        timeZone: this.timezone,
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const timeString = now.toLocaleTimeString("en-US", timeOptions);
      const [time, period] = timeString.split(" ");

      // Get date in specific timezone
      const dateOptions = {
        timeZone: this.timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const dateString = now.toLocaleDateString("en-US", dateOptions);

      // Get timezone offset
      const offset = TimeZoneUtils.getTimezoneOffset(now, this.timezone);

      // Update DOM elements
      if (this.timeElement) {
        this.timeElement.textContent = time;
        this.timeElement.classList.remove("loading");
      }

      if (this.periodElement) {
        this.periodElement.textContent = period;
      }

      if (this.dateElement) {
        this.dateElement.textContent = dateString;
        this.dateElement.classList.remove("loading");
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
        now.toLocaleTimeString("en-US", {
          timeZone: this.timezone,
          hour12: false,
          hour: "2-digit",
        })
      );

      const isNight = hour < 6 || hour >= 18;

      if (isNight) {
        this.element.classList.add("night-time");
        this.element.classList.remove("day-time");
      } else {
        this.element.classList.add("day-time");
        this.element.classList.remove("night-time");
      }
    } catch (error) {
      console.error(
        `Error updating day/night indicator for ${this.city}:`,
        error
      );
    }
  }

  showError() {
    if (this.timeElement) {
      this.timeElement.textContent = "Error";
      this.timeElement.classList.add("error");
    }
    if (this.dateElement) {
      this.dateElement.textContent = "Unable to load time";
      this.dateElement.classList.add("error");
    }
  }

  getUTCOffsetMinutes(date) {
    return TimeZoneUtils.getUTCOffsetMinutes(date, this.timezone);
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = WorldClock;
}
