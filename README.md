# World Clocks PWA

A responsive real-time world clock Progressive Web App displaying multiple timezones simultaneously with modular ES6 architecture. Installable as a native app on any device.

![World Clocks Application](cover.png)

## Overview

World Clocks is a clean, responsive Progressive Web App built with vanilla JavaScript that displays real-time clocks for multiple timezones around the world. Features a modular ES6 class-based architecture with performance optimizations, accessibility support, and full PWA functionality including offline support and installability.

**Status:** Fully functional PWA with dynamic city management, automatic UTC offset sorting, responsive grid layout, and native app installation capabilities. Performance optimizations include pausing updates when tab is not visible and screen wake lock support.

## Key Features

### 🌍 **Core Clock Features**
- **Real-time Updates** - All clocks update every second with accurate timezone information using `Intl.DateTimeFormat`
- **Multiple Timezones** - Display time for multiple cities simultaneously with automatic UTC offset sorting
- **Dynamic Management** - Add or remove cities at runtime through JavaScript API or configuration file

### 📱 **Progressive Web App (PWA)**
- **Installable** - Add to home screen on mobile devices and desktop as a native app
- **Offline Support** - Works without internet connection after first visit
- **Service Worker** - Background updates and resource caching
- **App Manifest** - Native app-like experience with custom splash screen

### 🔋 **Wake Lock Feature**
- **Screen Stay Awake** - Prevents screen from sleeping while app is active
- **Toggle Control** - Easy on/off switch in the header
- **Smart Management** - Automatic release when tab is hidden to save battery
- **Cross-Platform** - Works on Chrome, Safari, Edge (84+)

### 🎨 **Design & UX**
- **Responsive Design** - CSS Grid layout that adapts from 1 column on mobile to 4+ columns on large screens
- **Custom Icon** - Professional SVG-based app icon with globe and clock theme
- **Modern UI** - Clean design with subtle animations and glass-morphism effects
- **Accessibility** - Keyboard navigation, ARIA labels, and screen reader support

### ⚡ **Performance & Architecture**
- **Modular Architecture** - Clean ES6 class-based architecture with separate modules for different concerns
- **Performance Optimized** - Updates pause when browser tab is not visible to save resources
- **Efficient Caching** - Smart service worker caching strategy for optimal loading

## Quick Start

### 📱 **Install as App (Recommended)**
1. Visit [https://shaheem-pp.github.io/times-es6/](https://shaheem-pp.github.io/times-es6/)
2. Look for the "Install" prompt or click the install button
3. **Chrome/Edge**: Click "Install" in the address bar
4. **iOS Safari**: Share → "Add to Home Screen"
5. **Android**: Tap "Install App" banner

### 💻 **Local Development**
1. Clone the repository and navigate to the project directory
2. Start a local web server (required for ES6 modules and PWA features)  
3. Open `http://localhost:8000` in your browser

> **Note**: A web server is required due to ES6 module imports, service worker, and CORS restrictions.

## Architecture

The application uses a modular ES6 class-based architecture with clear separation of concerns:

### 🏗️ **Core Modules**
- **WorldClocksApp** - Main application controller handling initialization and coordination
- **WorldClock** - Individual clock component with rendering logic and time updates  
- **TimeZoneUtils** - Utility functions for timezone calculations and formatting
- **GridManager** - Responsive grid layout management and card positioning
- **EventManager** - User interaction and event handling across components

### 📱 **PWA Modules**
- **PWAManager** - Handles service worker registration, install prompts, and updates
- **WakeLockManager** - Screen sleep prevention with user controls and smart battery management

### 🔧 **Service Worker**
- **Caching Strategy** - Smart caching of static assets and dynamic content
- **Offline Support** - Graceful fallback when network is unavailable
- **Background Updates** - Automatic app updates with user notifications

## Technical Stack

- **JavaScript ES6+** - Modern JavaScript with classes and modules
- **HTML5** - Semantic markup and modern web standards
- **CSS3** - Modern styling with Grid and Flexbox
- **PWA Technologies** - Service Worker, Web App Manifest, Wake Lock API
- **CSS Grid** - Responsive layout system
- **Tailwind CSS** 2.2.19 - Utility-first CSS framework
- **Font Awesome** 6.0.0 - Icon library
- **Intl.DateTimeFormat API** - Native browser timezone handling
- **Custom SVG Icons** - Scalable vector graphics for all app icons

## Project Structure

```
times/
├── index.html              # Main application entry point
├── cities.js               # City configuration
├── cover.png              # Application screenshot
├── manifest.json          # PWA manifest file
├── sw.js                  # Service worker for offline support
├── app-icon.svg          # Custom SVG app icon source
├── icons/                # Generated PWA icons (all sizes)
├── offline.html          # Offline fallback page
├── PWA-SETUP.md         # PWA implementation guide
├── WAKE-LOCK.md         # Wake lock feature documentation
├── ICON-DESIGN.md       # Icon design documentation
├── src/
│   ├── constants.ts        # Project metadata and structure
│   ├── js/
│   │   ├── WorldClocksApp.js    # Main application controller
│   │   ├── WorldClock.js        # Individual clock component
│   │   ├── TimeZoneUtils.js     # Timezone utilities
│   │   ├── GridManager.js       # Layout management
│   │   ├── EventManager.js      # Event handling
│   │   ├── PWAManager.js        # PWA functionality manager
│   │   └── WakeLockManager.js   # Screen wake lock management
│   └── css/
│       ├── main.css            # Main stylesheet
│       ├── base.css            # Base styles
│       ├── grid.css            # Grid layout
│       ├── clock-elements.css  # Clock styling
│       ├── animations.css      # Animations
│       ├── background.css      # Background styles
│       └── components/         # Component styles
│           ├── header.css      # Header component
│           ├── clock-card.css  # Clock card component
│           └── wake-lock.css   # Wake lock UI styles
└── config/                     # Configuration files
```

## Configuration

### Adding Cities

Edit the `WORLD_CITIES` array in `cities.js`:

```javascript
const WORLD_CITIES = [
  {
    timezone: "America/New_York",
    city: "New York",
    country: "United States",
    flag: "🇺🇸",
  },
  {
    timezone: "Europe/London",
    city: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
  },
  // Add more cities...
];
```

### Dynamic Operations

```javascript
// Add cities at runtime
worldClocks.addTimezone("Asia/Tokyo", "Tokyo", "Japan", "🇯🇵");

// Remove cities
worldClocks.removeTimezone("Tokyo");

// Get all cities
const cities = worldClocks.getAllCities();
```

### PWA Features

```javascript
// Wake lock controls
await window.wakeLockManager.enableWakeLock();   // Keep screen awake
await window.wakeLockManager.disableWakeLock();  // Allow screen sleep
window.wakeLockManager.toggleWakeLock();         // Toggle state

// PWA status
window.pwaManager.getInstallationStatus();      // Check if installable/installed
```

## Demo & Links

- **🌐 Live PWA:** [https://shaheem-pp.github.io/times-es6/](https://shaheem-pp.github.io/times-es6/) - Install as app!
- **📱 Install Guide:** Click the install button or use your browser's "Add to Home Screen" feature
- **💻 Source Code:** [https://github.com/shaheem-pp/times-es6](https://github.com/shaheem-pp/times-es6)
- **📋 PWA Setup:** See [PWA-SETUP.md](PWA-SETUP.md) for implementation details
- **🔋 Wake Lock:** See [WAKE-LOCK.md](WAKE-LOCK.md) for screen sleep prevention features

## Technical Highlights

### 🚀 **Modern PWA Implementation**
- Built with vanilla JavaScript ES6+ classes and modules for clean separation of concerns
- Full Progressive Web App features including installability and offline support
- Advanced service worker with smart caching strategies and update management
- Screen Wake Lock API integration for continuous display applications

### 🌐 **Cross-Platform Compatibility**
- Utilizes modern web APIs like `Intl.DateTimeFormat` for accurate timezone handling
- CSS Grid and Flexbox for responsive layout without external grid frameworks
- Component-based CSS architecture with modular stylesheets
- Custom SVG icons that scale perfectly across all device resolutions

### ⚡ **Performance & UX**
- Performance optimizations including efficient DOM updates and visibility-based pausing
- Smart wake lock management that preserves battery when not needed
- Accessibility features with keyboard navigation, ARIA labels, and screen reader support
- Glass-morphism design effects with Safari compatibility (backdrop-filter)

### Browser Compatibility

#### PWA Features
- **Chrome 88+** | **Edge 88+** | **Safari 14+** | **Firefox 78+**
- **iOS Safari 14.5+** | **Android Chrome 88+** | **Samsung Internet 15+**

#### Wake Lock Support
- **Chrome 84+** ✅ | **Edge 84+** ✅ | **Safari 16.4+** ✅ | **Firefox** ⚠️ (Behind flag)

World Clocks demonstrates modern vanilla JavaScript development practices with a focus on performance, accessibility, PWA standards, and maintainable code architecture.

## Development

### Local Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/shaheem-pp/times-es6.git
   cd times-es6
   ```

2. Start a local web server (required for ES6 modules and PWA features):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Using PHP  
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

> **Note**: A web server is required due to ES6 module imports, service worker registration, and CORS restrictions.

### PWA Development

To work with PWA features during development:

1. **Test Installation**: Use Chrome DevTools → Application → Manifest
2. **Service Worker**: Debug in Application → Service Workers tab  
3. **Wake Lock**: Test in a supported browser (Chrome 84+, Safari 16.4+)
4. **Offline Mode**: Use Network tab to simulate offline conditions
5. **Icon Generation**: Run `./generate-icons.sh` to regenerate all icon sizes

### Project Metadata

This project follows a structured format with metadata defined in `src/constants.ts`:

```typescript
export interface Project {
  title: string;
  image: string;
  shortContent: string;
  description: string;
  links: { [iconClass: string]: string | undefined };
  stack: string[];
  status: string;
  category: string;
  featured: boolean;
}
```

Category: **Progressive Web App** | Status: **Production Ready** | Featured: **Yes**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
