# 🔋 Wake Lock Feature - Keep Screen Awake

## Overview
The Wake Lock feature prevents your device's screen from sleeping while the World Clocks app is active. This is especially useful for clock applications where you want to keep the time visible continuously.

## ✅ Features Added

### 🔒 **Screen Sleep Prevention**
- Automatically keeps the screen awake when the app is active
- Uses the modern [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- Gracefully handles unsupported browsers

### 🎛️ **Toggle Control**
- **Eye icon button** in the top-right corner of the app
- **Click to toggle** wake lock on/off
- **Visual feedback** showing current state
- **Accessible** with proper ARIA labels

### 📱 **Status Notifications**
- **Popup notifications** when wake lock state changes
- **Auto-hide** after 3 seconds
- **Mobile-friendly** responsive design
- **Clear indicators** (ON/OFF status)

### 🔄 **Smart Management**
- **Automatic re-acquisition** when returning to the tab
- **Releases when page becomes hidden** (saves battery)
- **Cleanup on app close** (proper resource management)
- **Error handling** for failed requests

## 📱 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome 84+** | ✅ Full Support | Recommended |
| **Edge 84+** | ✅ Full Support | Recommended |
| **Safari 16.4+** | ✅ Full Support | Recent versions |
| **Firefox** | ⚠️ Experimental | Behind flag |
| **iOS Safari** | ✅ Supported | iOS 16.4+ |
| **Android Chrome** | ✅ Full Support | Recommended |

## 🎮 How to Use

### For Users:
1. **Automatic**: Wake lock is enabled by default when you open the app
2. **Toggle**: Click the eye icon (👁️) in the top-right corner to toggle
3. **Status**: Look for the popup notification showing "Screen Stay Awake: ON/OFF"

### For Developers:
```javascript
// Wake lock is automatically initialized
window.wakeLockManager

// Check status
window.wakeLockManager.getStatus()
// Returns: { isSupported: true, isActive: true, hasWakeLock: true }

// Manual control
await window.wakeLockManager.enableWakeLock()
await window.wakeLockManager.disableWakeLock()
await window.wakeLockManager.toggleWakeLock()

// Check if currently active
window.wakeLockManager.isWakeLockActive()
```

## 🔧 Technical Implementation

### Files Added:
- `src/js/WakeLockManager.js` - Main wake lock functionality
- `src/css/components/wake-lock.css` - Styling for UI elements

### Key Features:
- **Error Handling**: Graceful fallback for unsupported browsers
- **Memory Management**: Proper cleanup and resource release
- **Performance**: Minimal overhead, only active when needed
- **Accessibility**: Keyboard navigation and screen reader support

## 📋 Use Cases

### Perfect For:
- ⏰ **Clock Applications** (like World Clocks)
- 📺 **Presentation Mode**
- 🎵 **Music/Video Players**
- 📊 **Dashboard Displays**
- 🏃‍♂️ **Fitness Tracking**
- 🎮 **Game Interfaces**

### When Wake Lock Activates:
- ✅ App is in the foreground
- ✅ User has enabled the feature
- ✅ Device supports Wake Lock API
- ✅ Page is visible (not minimized)

### When Wake Lock Releases:
- ❌ User toggles it off
- ❌ Page becomes hidden/minimized
- ❌ User switches tabs
- ❌ App is closed
- ❌ Battery optimization kicks in

## 🛠️ Customization

### Styling the Toggle Button:
```css
#wake-lock-toggle {
  /* Customize button appearance */
  background: your-color;
  border-radius: your-radius;
}
```

### Changing Default State:
```javascript
// In WakeLockManager constructor
this.isActive = false; // Start disabled
```

### Custom Notifications:
```javascript
// Override the showWakeLockStatus method
window.wakeLockManager.showWakeLockStatus = (isEnabled) => {
  // Your custom notification logic
};
```

## 🚀 Benefits

### For Users:
- **No manual screen wake-up** needed
- **Continuous time visibility** for clocks
- **Better user experience** for prolonged viewing
- **Battery-aware** (releases when not needed)

### For Developers:
- **Modern API usage** with proper fallbacks
- **Clean, maintainable code** structure
- **Responsive design** out of the box
- **Extensive browser support**

## 🔍 Troubleshooting

### Wake Lock Not Working?
1. **Check browser support** (Chrome 84+, Safari 16.4+)
2. **Ensure HTTPS** (required for Wake Lock API)
3. **Check console** for error messages
4. **Try toggling** the feature off and on
5. **Refresh the page** if issues persist

### Button Not Visible?
1. **Check CSS import** in main.css
2. **Verify header element** exists
3. **Check console** for JavaScript errors
4. **Try different screen size** (responsive design)

The Wake Lock feature makes your World Clocks app even more useful by ensuring the time stays visible when you need it most! 🕐✨
