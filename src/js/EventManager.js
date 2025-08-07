// src/js/EventManager.js - Event handling and performance management
class EventManager {
  constructor() {
    this.isVisible = true;
    this.listeners = new Map();
    this.setupVisibilityListeners();
    this.setupPerformanceListeners();
  }

  setupVisibilityListeners() {
    // Pause updates when tab is not visible to save resources
    document.addEventListener("visibilitychange", () => {
      this.isVisible = !document.hidden;
      this.emit("visibilityChange", this.isVisible);

      if (this.isVisible) {
        this.emit("tabVisible");
      } else {
        this.emit("tabHidden");
      }
    });

    // Handle window focus/blur
    window.addEventListener("focus", () => {
      this.isVisible = true;
      this.emit("windowFocus");
    });

    window.addEventListener("blur", () => {
      this.isVisible = false;
      this.emit("windowBlur");
    });
  }

  setupPerformanceListeners() {
    // Handle online/offline status
    window.addEventListener("online", () => {
      console.log("Connection restored");
      this.emit("connectionRestored");
    });

    window.addEventListener("offline", () => {
      console.log("Connection lost");
      this.emit("connectionLost");
    });

    // Handle page load
    window.addEventListener("load", () => {
      this.emit("pageLoad");
    });
  }

  // Event emitter pattern
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, ...args) {
    if (!this.listeners.has(event)) return;

    this.listeners.get(event).forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // Add keyboard and mouse event handlers for clock cards
  setupClockCardListeners(clockCard, onClickCallback) {
    // Click handler
    clockCard.addEventListener("click", onClickCallback);

    // Keyboard accessibility
    clockCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClickCallback();
      }
    });

    // Make clock cards focusable for accessibility
    clockCard.setAttribute("tabindex", "0");
    clockCard.setAttribute("role", "button");
  }

  // Cleanup method
  destroy() {
    this.listeners.clear();
  }

  // Check if device prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = EventManager;
}
