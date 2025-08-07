// cities.js - Centralized city configuration for World Clocks

/**
 * All city configurations in one place
 * Add, remove, or modify cities here
 *
 * Each city object should have:
 * - timezone: IANA timezone identifier (e.g., "America/New_York")
 * - city: Display name of the city
 * - country: Country or region name
 * - flag: Unicode flag emoji
 */

const WORLD_CITIES = [
  // North America
  //   {
  //     timezone: "America/Vancouver",
  //     city: "Vancouver",
  //     country: "Canada",
  //     flag: "🇨🇦",
  //   },
  {
    timezone: "America/Toronto",
    city: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
  },

  // Europe
  {
    timezone: "Europe/London",
    city: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
  },

  // Middle East
  {
    timezone: "Asia/Riyadh",
    city: "Dammam",
    country: "Saudi Arabia",
    flag: "🇸🇦",
  },
  {
    timezone: "Asia/Dubai",
    city: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
  },

  // Asia
  {
    timezone: "Asia/Kolkata",
    city: "Kerala",
    country: "India",
    flag: "🇮🇳",
  },
  {
    timezone: "Asia/Kuala_Lumpur",
    city: "Kuala Lumpur",
    country: "Malaysia",
    flag: "🇲🇾",
  },

  // Additional cities (uncomment to add more)
  //
  // Americas
  // {
  //   timezone: "America/New_York",
  //   city: "New York",
  //   country: "USA",
  //   flag: "🇺🇸"
  // },
  // {
  //   timezone: "America/Los_Angeles",
  //   city: "Los Angeles",
  //   country: "USA",
  //   flag: "🇺🇸"
  // },
  // {
  //   timezone: "America/Chicago",
  //   city: "Chicago",
  //   country: "USA",
  //   flag: "🇺🇸"
  // },
  // {
  //   timezone: "America/Mexico_City",
  //   city: "Mexico City",
  //   country: "Mexico",
  //   flag: "🇲🇽"
  // },
  // {
  //   timezone: "America/Sao_Paulo",
  //   city: "São Paulo",
  //   country: "Brazil",
  //   flag: "🇧🇷"
  // },

  // Europe
  // {
  //   timezone: "Europe/Paris",
  //   city: "Paris",
  //   country: "France",
  //   flag: "🇫🇷"
  // },
  // {
  //   timezone: "Europe/Berlin",
  //   city: "Berlin",
  //   country: "Germany",
  //   flag: "🇩🇪"
  // },
  // {
  //   timezone: "Europe/Rome",
  //   city: "Rome",
  //   country: "Italy",
  //   flag: "🇮🇹"
  // },
  // {
  //   timezone: "Europe/Madrid",
  //   city: "Madrid",
  //   country: "Spain",
  //   flag: "🇪🇸"
  // },
  // {
  //   timezone: "Europe/Moscow",
  //   city: "Moscow",
  //   country: "Russia",
  //   flag: "🇷🇺"
  // },

  // Asia
  // {
  //   timezone: "Asia/Tokyo",
  //   city: "Tokyo",
  //   country: "Japan",
  //   flag: "🇯🇵"
  // },
  // {
  //   timezone: "Asia/Shanghai",
  //   city: "Shanghai",
  //   country: "China",
  //   flag: "🇨🇳"
  // },
  // {
  //   timezone: "Asia/Seoul",
  //   city: "Seoul",
  //   country: "South Korea",
  //   flag: "🇰🇷"
  // },
  // {
  //   timezone: "Asia/Singapore",
  //   city: "Singapore",
  //   country: "Singapore",
  //   flag: "🇸🇬"
  // },
  // {
  //   timezone: "Asia/Hong_Kong",
  //   city: "Hong Kong",
  //   country: "Hong Kong",
  //   flag: "🇭🇰"
  // },
  // {
  //   timezone: "Asia/Bangkok",
  //   city: "Bangkok",
  //   country: "Thailand",
  //   flag: "🇹🇭"
  // },
  // {
  //   timezone: "Asia/Mumbai",
  //   city: "Mumbai",
  //   country: "India",
  //   flag: "🇮🇳"
  // },

  // Australia/Pacific
  // {
  //   timezone: "Australia/Sydney",
  //   city: "Sydney",
  //   country: "Australia",
  //   flag: "🇦🇺"
  // },
  // {
  //   timezone: "Australia/Melbourne",
  //   city: "Melbourne",
  //   country: "Australia",
  //   flag: "🇦🇺"
  // },
  // {
  //   timezone: "Pacific/Auckland",
  //   city: "Auckland",
  //   country: "New Zealand",
  //   flag: "🇳🇿"
  // },

  // Africa
  // {
  //   timezone: "Africa/Cairo",
  //   city: "Cairo",
  //   country: "Egypt",
  //   flag: "🇪🇬"
  // },
  // {
  //   timezone: "Africa/Lagos",
  //   city: "Lagos",
  //   country: "Nigeria",
  //   flag: "🇳🇬"
  // },
];

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { WORLD_CITIES };
}
