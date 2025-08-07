# 🌍 World Clocks

A beautiful, responsive web application that displays real-time clocks for multiple time zones### Other Operations

````javascript
// Get all current cities
const cities = worldClocks.getAllCities();

// Find a specific city
const paris = worldClocks.findCity('Paris');

// Sort all cities by UTC offset
worldClocks.sortAllCitiesByUTCOffset();

// Get user's timezone
const userTz = Utils.getUserTimezone();
```world. Built with vanilla JavaScript, HTML5, and CSS3 with Tailwind CSS for styling.

## ✨ Features

- **Real-time Updates**: All clocks update every second with accurate time information
- **Centralized Configuration**: All cities managed in a single `cities.js` file
- **UTC Sorting**: Cities automatically sorted by UTC offset for logical time zone order
- **Multiple Time Zones**: Pre-configured with 7 major cities (Vancouver, Toronto, London, Dammam, Dubai, Kerala, Kuala Lumpur)
- **Easy City Management**: Add or remove cities by editing one configuration file
- **Dynamic Addition**: Add or remove cities programmatically at runtime
- **Responsive Design**: Automatically adapts to different screen sizes and device types
- **Day/Night Indicators**: Visual cues showing whether it's day or night in each location
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance Optimized**: Pauses updates when tab is not visible to save resources
- **Beautiful Animations**: Smooth transitions and hover effects
- **Error Handling**: Graceful handling of timezone errors with fallback displays

## 🏗️ Project Structure

````

times/
├── index.html # Main HTML file with clock container
├── cities.js # Centralized city configurations
├── script.js # JavaScript functionality and clock logic
├── styles.css # Custom CSS with responsive design
└── README.md # Project documentation

````

## 🚀 Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- No server setup required - runs entirely in the browser

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. The clocks will start automatically!

### Local Development

For local development with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
````

Then open `http://localhost:8000` in your browser.

## 🎯 Usage

### Basic Usage

Simply open `index.html` in your browser to see the world clocks in action.

### Adding New Cities

#### Method 1: Edit Configuration (Permanent)

Edit the `WORLD_CITIES` array in `cities.js`:

```javascript
const WORLD_CITIES = [
  // Existing cities...

  // Add new cities here
  { timezone: "Asia/Tokyo", city: "Tokyo", country: "Japan", flag: "🇯🇵" },
  { timezone: "Europe/Paris", city: "Paris", country: "France", flag: "🇫🇷" },
  // Uncomment any from the extensive list provided
];
```

#### Method 2: Dynamic Addition (Runtime)

Use the browser console or embed in your code:

```javascript
// Add a single city
worldClocks.addTimezone("Europe/Berlin", "Berlin", "Germany", "🇩🇪");

// Add multiple cities
worldClocks.addMultipleTimezones([
  { timezone: "Asia/Seoul", city: "Seoul", country: "South Korea", flag: "🇰🇷" },
  {
    timezone: "Australia/Sydney",
    city: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
  },
]);
```

### Removing Cities

```javascript
// Remove a specific city
worldClocks.removeTimezone("Tokyo");

// Clear all dynamically added cities
worldClocks.clearDynamicCities();
```

### Other Operations

```javascript
// Get all current cities
const cities = worldClocks.getAllCities();

// Find a specific city
const paris = worldClocks.findCity("Paris");

// Get user's timezone
const userTz = Utils.getUserTimezone();
```

## 🎨 Customization

### Styling

The project uses a combination of:

- **Tailwind CSS**: For utility classes and responsive design
- **Custom CSS**: For animations, glassmorphism effects, and specific styling
- **Font Awesome**: For icons
- **Google Fonts**: Inter font family

### Color Scheme

- Background: Gradient from gray-900 through blue-900 to purple-900
- Cards: Glassmorphism effect with rgba backgrounds
- Text: White and gray shades for hierarchy
- Accent: Blue-400 for highlights

### Responsive Breakpoints

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2-3 columns)
- **Desktop**: 1024px - 1280px (3-4 columns)
- **Large**: > 1280px (4+ columns)

## 🔧 Technical Details

### Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Edge 88+

### Dependencies

- [Tailwind CSS](https://tailwindcss.com/) (2.2.19) - Utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) (6.0.0) - Icons
- [Google Fonts](https://fonts.google.com/) (Inter) - Typography

### Key Technologies

- **Intl.DateTimeFormat**: For accurate timezone handling
- **CSS Grid**: For responsive layout
- **CSS Animations**: For smooth interactions
- **Intersection Observer**: For performance optimization
- **Local Storage**: Could be added for user preferences

### Performance Features

- Updates pause when tab is hidden
- Efficient DOM updates
- Minimal reflows and repaints
- Debounced resize handling

## 🌐 Supported Time Zones

The app supports any valid IANA timezone identifier. Some examples:

### Americas

- `America/Vancouver`, `America/Toronto`, `America/New_York`
- `America/Los_Angeles`, `America/Chicago`, `America/Mexico_City`

### Europe

- `Europe/London`, `Europe/Paris`, `Europe/Berlin`
- `Europe/Rome`, `Europe/Moscow`, `Europe/Madrid`

### Asia

- `Asia/Dubai`, `Asia/Riyadh`, `Asia/Kolkata`
- `Asia/Tokyo`, `Asia/Shanghai`, `Asia/Seoul`

### Australia/Pacific

- `Australia/Sydney`, `Australia/Melbourne`
- `Pacific/Auckland`, `Pacific/Honolulu`

## 🎨 Features in Detail

### Dynamic Grid Layout

- Automatically adjusts columns based on number of cities
- Maintains aspect ratios across different screen sizes
- Smooth animations when adding/removing cities

### Accessibility Features

- Keyboard navigation support
- ARIA labels for screen readers
- High contrast mode support
- Reduced motion support for users with vestibular disorders

### Visual Indicators

- Day/night background changes based on local time
- Timezone offset display (UTC±XX:XX)
- Loading states with pulse animations
- Error states with shake animations

### Interaction Design

- Hover effects with subtle transforms
- Click feedback animations
- Focus states for keyboard navigation
- Responsive touch targets

## 🐛 Troubleshooting

### Common Issues

**Clocks show "Error" or "--:--:--"**

- Check browser compatibility
- Ensure JavaScript is enabled
- Verify timezone identifiers are valid

**Layout looks broken on mobile**

- Check if Tailwind CSS loaded properly
- Ensure viewport meta tag is present
- Clear browser cache

**Performance issues**

- Check if too many cities are added
- Ensure browser tab is visible
- Update to a modern browser

### Debug Mode

Open browser console to see debug information:

```javascript
// Enable verbose logging
console.log(worldClocks.getAllCities());
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) for beautiful icons
- [Google Fonts](https://fonts.google.com/) for the Inter typeface
- [MDN Web Docs](https://developer.mozilla.org/) for excellent documentation

## 📞 Support

If you have any questions or need help:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Check browser console for error messages

---

<div align="center">
Made with ❤️ for developers who work across time zones
</div>
