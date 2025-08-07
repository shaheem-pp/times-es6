// src/js/GridManager.js - Grid layout and responsive management
class GridManager {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.setupResponsiveListeners();
  }

  updateGridLayout(cardCount) {
    if (!this.container) return;

    this.container.setAttribute("data-card-count", cardCount);
    console.log(`Updated grid for ${cardCount} cards`);
  }

  setupResponsiveListeners() {
    // Handle window resize for responsive adjustments
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    // Trigger any necessary layout recalculations
    const cardCount = this.container?.children.length || 0;
    this.updateGridLayout(cardCount);
  }

  addCard(cardElement) {
    if (!this.container) return;

    this.container.appendChild(cardElement);
    this.updateGridLayout(this.container.children.length);
  }

  removeCard(cardElement) {
    if (!this.container || !cardElement) return;

    cardElement.remove();
    this.updateGridLayout(this.container.children.length);
  }

  clearAllCards() {
    if (!this.container) return;

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.updateGridLayout(0);
  }

  getOptimalColumns(cardCount) {
    const breakpoints = {
      mobile: window.innerWidth < 768,
      tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      desktop: window.innerWidth >= 1024 && window.innerWidth < 1280,
      large: window.innerWidth >= 1280,
    };

    if (breakpoints.mobile) {
      return 1;
    } else if (breakpoints.tablet) {
      return Math.min(cardCount, 2);
    } else if (breakpoints.desktop) {
      return Math.min(cardCount, 3);
    } else {
      return Math.min(cardCount, 4);
    }
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = GridManager;
}
