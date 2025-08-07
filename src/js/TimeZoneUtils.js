// src/js/TimeZoneUtils.js - Timezone utility functions
class TimeZoneUtils {
  static getTimezoneOffset(date, timezone) {
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

  static getUTCOffsetMinutes(date, timezone) {
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

  static formatOffset(offsetMinutes) {
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? "+" : "-";
    return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  static getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  static sortCitiesByUTCOffset(cities) {
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
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = TimeZoneUtils;
}
