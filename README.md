# World Clocks

A responsive real-time world clock application built with vanilla JavaScript, HTML5, and CSS3.

![World Clocks Application](cover.png)

## Features

- **Real-time Updates** - All clocks update every second with accurate timezone information
- **Multiple Timezones** - Display time for multiple cities simultaneously
- **Responsive Design** - Adapts to different screen sizes and devices
- **Modular Architecture** - Clean, maintainable JavaScript modules
- **Performance Optimized** - Pauses updates when tab is not visible
- **Accessibility** - Keyboard navigation and screen reader support

## Quick Start

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd times
   ```

2. Start a local web server (required for ES6 modules):

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve

   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

> **Note**: A web server is required due to ES6 module imports and CORS restrictions.

## Project Structure

```
times/
├── index.html              # Main application entry point
├── cities.js               # City configuration
├── cover.png              # Application screenshot
├── src/
│   ├── js/
│   │   ├── WorldClocksApp.js    # Main application controller
│   │   ├── WorldClock.js        # Individual clock component
│   │   ├── TimeZoneUtils.js     # Timezone utilities
│   │   ├── GridManager.js       # Layout management
│   │   └── EventManager.js      # Event handling
│   └── css/
│       ├── main.css            # Main stylesheet
│       ├── base.css            # Base styles
│       ├── grid.css            # Grid layout
│       ├── clock-elements.css  # Clock styling
│       ├── animations.css      # Animations
│       └── components/         # Component styles
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
worldClocks.addTimezone("Asia/Tokyo", "Tokyo", "Japan", "��");

// Remove cities
worldClocks.removeTimezone("Tokyo");

// Get all cities
const cities = worldClocks.getAllCities();
```

## Technical Details

### Dependencies

- **Tailwind CSS** 2.2.19 - Utility-first CSS framework
- **Font Awesome** 6.0.0 - Icon library
- **Google Fonts** - Inter typography

### Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

### Key Technologies

- ES6 Modules for modular architecture
- `Intl.DateTimeFormat` for timezone handling
- CSS Grid for responsive layouts
- CSS animations for smooth interactions

## Development

### Architecture

The application uses a modular ES6 class-based architecture:

- **WorldClocksApp** - Main application controller and initialization
- **WorldClock** - Individual clock component with rendering logic
- **TimeZoneUtils** - Timezone calculation and formatting utilities
- **GridManager** - Responsive grid layout management
- **EventManager** - User interaction and event handling

### Performance

- Updates pause when browser tab is not visible
- Efficient DOM updates with minimal reflows
- Automatic UTC offset sorting for logical display

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
