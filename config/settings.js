// config/settings.js - Application settings and configuration
const AppConfig = {
  // Update intervals
  clockUpdateInterval: 1000, // milliseconds

  // Grid settings
  grid: {
    maxColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      large: 4,
    },
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280,
    },
    gap: "1.5rem",
    cardMinHeight: "120px",
  },

  // Animation settings
  animations: {
    cardSlideInDelay: 100, // milliseconds between each card
    cardHoverScale: 1.02,
    clickFeedbackScale: 0.98,
    clickFeedbackDuration: 150,
  },

  // Time display settings
  timeFormat: {
    hour12: true,
    showSeconds: true,
    showTimezoneOffset: true,
    showDate: true,
    showDayNight: true,
  },

  // Theme settings (for future use)
  theme: {
    defaultTheme: "dark",
    supportedThemes: ["dark", "light", "auto"],
    accentColor: "#3b82f6", // blue-500
  },

  // Performance settings
  performance: {
    pauseOnTabHidden: true,
    pauseOnWindowBlur: true,
    debounceResizeDelay: 250,
  },

  // Accessibility settings
  accessibility: {
    respectReducedMotion: true,
    keyboardNavigation: true,
    screenReaderSupport: true,
  },

  // Development settings
  development: {
    enableConsoleLogging: true,
    showPerformanceMetrics: false,
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = AppConfig;
}
