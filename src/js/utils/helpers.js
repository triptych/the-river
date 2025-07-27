/**
 * Helper Utilities - The River Game
 * Common utility functions used throughout the game
 */

/**
 * DOM manipulation helpers
 */
const DOM = {
    /**
     * Get element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} - Element or null if not found
     */
    get(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    },

    /**
     * Get elements by class name
     * @param {string} className - Class name
     * @param {HTMLElement} parent - Parent element (optional)
     * @returns {NodeList} - List of elements
     */
    getByClass(className, parent = document) {
        return parent.querySelectorAll(`.${className}`);
    },

    /**
     * Create element with attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Attributes object
     * @param {string} content - Inner content
     * @returns {HTMLElement} - Created element
     */
    create(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    },

    /**
     * Show element with animation
     * @param {HTMLElement} element - Element to show
     * @param {string} animationClass - Animation class to add
     */
    show(element, animationClass = 'fadeIn') {
        if (!element) return;

        element.style.display = '';
        element.classList.remove('hidden');
        element.classList.add(animationClass);

        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 500);
    },

    /**
     * Hide element with animation
     * @param {HTMLElement} element - Element to hide
     * @param {string} animationClass - Animation class to add
     */
    hide(element, animationClass = 'fadeOut') {
        if (!element) return;

        element.classList.add(animationClass);

        setTimeout(() => {
            element.style.display = 'none';
            element.classList.add('hidden');
            element.classList.remove(animationClass);
        }, 300);
    },

    /**
     * Toggle element visibility
     * @param {HTMLElement} element - Element to toggle
     */
    toggle(element) {
        if (!element) return;

        if (element.style.display === 'none' || element.classList.contains('hidden')) {
            this.show(element);
        } else {
            this.hide(element);
        }
    }
};

/**
 * Animation helpers
 */
const Animation = {
    /**
     * Add CSS class with automatic removal
     * @param {HTMLElement} element - Target element
     * @param {string} className - Class name to add
     * @param {number} duration - Duration in milliseconds
     */
    addTemporaryClass(element, className, duration = 1000) {
        if (!element) return;

        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    },

    /**
     * Animate number counting
     * @param {HTMLElement} element - Element to update
     * @param {number} start - Starting number
     * @param {number} end - Ending number
     * @param {number} duration - Animation duration in milliseconds
     * @param {Function} formatter - Number formatting function
     */
    countTo(element, start, end, duration = 1000, formatter = (n) => Math.round(n)) {
        if (!element) return;

        const startTime = performance.now();
        const difference = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (difference * easeOut);

            element.textContent = formatter(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    /**
     * Shake element animation
     * @param {HTMLElement} element - Element to shake
     * @param {number} intensity - Shake intensity (1-10)
     */
    shake(element, intensity = 5) {
        if (!element) return;

        const originalTransform = element.style.transform;
        let shakeCount = 0;
        const maxShakes = 6;

        const shake = () => {
            if (shakeCount >= maxShakes) {
                element.style.transform = originalTransform;
                return;
            }

            const x = (Math.random() - 0.5) * intensity * 2;
            const y = (Math.random() - 0.5) * intensity * 2;

            element.style.transform = `translate(${x}px, ${y}px) ${originalTransform}`;
            shakeCount++;

            setTimeout(shake, 100);
        };

        shake();
    }
};

/**
 * Math and utility helpers
 */
const Utils = {
    /**
     * Generate random number between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random number
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Generate random float between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random float
     */
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Choose random element from array
     * @param {Array} array - Array to choose from
     * @returns {*} - Random element
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} - Shuffled array (new array)
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Clamp number between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation between two values
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} - Interpolated value
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Map value from one range to another
     * @param {number} value - Input value
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     * @returns {number} - Mapped value
     */
    map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    /**
     * Calculate distance between two points
     * @param {number} x1 - First point X
     * @param {number} y1 - First point Y
     * @param {number} x2 - Second point X
     * @param {number} y2 - Second point Y
     * @returns {number} - Distance
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} - Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }

        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} - Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/**
 * String formatting helpers
 */
const Format = {
    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} - Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Convert camelCase to Title Case
     * @param {string} str - CamelCase string
     * @returns {string} - Title Case string
     */
    camelToTitle(str) {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    },

    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string} - Formatted number
     */
    numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Format time duration
     * @param {number} seconds - Duration in seconds
     * @returns {string} - Formatted duration
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    },

    /**
     * Truncate string with ellipsis
     * @param {string} str - String to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} - Truncated string
     */
    truncate(str, maxLength) {
        if (str.length <= maxLength) {
            return str;
        }
        return str.slice(0, maxLength - 3) + '...';
    },

    /**
     * Format file size in bytes to human readable
     * @param {number} bytes - Size in bytes
     * @returns {string} - Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

/**
 * Event handling helpers
 */
const Events = {
    /**
     * Add event listener with automatic cleanup
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     * @returns {Function} - Cleanup function
     */
    on(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);

        // Return cleanup function
        return () => {
            element.removeEventListener(event, handler, options);
        };
    },

    /**
     * Add one-time event listener
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    once(element, event, handler) {
        const onceHandler = (e) => {
            handler(e);
            element.removeEventListener(event, onceHandler);
        };
        element.addEventListener(event, onceHandler);
    },

    /**
     * Emit custom event
     * @param {HTMLElement} element - Target element
     * @param {string} eventName - Event name
     * @param {*} detail - Event detail data
     */
    emit(element, eventName, detail = null) {
        const event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }
};

/**
 * Local storage helpers with error handling
 */
const Storage = {
    /**
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} - Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },

    /**
     * Get item from localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} - Retrieved value or default
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    }
};

/**
 * Color manipulation helpers
 */
const Color = {
    /**
     * Convert hex color to RGB
     * @param {string} hex - Hex color string
     * @returns {Object} - RGB object {r, g, b}
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Convert RGB to hex color
     * @param {number} r - Red value (0-255)
     * @param {number} g - Green value (0-255)
     * @param {number} b - Blue value (0-255)
     * @returns {string} - Hex color string
     */
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    /**
     * Lighten or darken a hex color
     * @param {string} hex - Hex color string
     * @param {number} percent - Percentage to lighten (positive) or darken (negative)
     * @returns {string} - Modified hex color
     */
    adjustBrightness(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const adjust = (value) => {
            const adjusted = value + (value * percent / 100);
            return Math.max(0, Math.min(255, Math.round(adjusted)));
        };

        return this.rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
    }
};

// Export all helpers to global scope
window.DOM = DOM;
window.Animation = Animation;
window.Utils = Utils;
window.Format = Format;
window.Events = Events;
window.Storage = Storage;
window.Color = Color;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DOM,
        Animation,
        Utils,
        Format,
        Events,
        Storage,
        Color
    };
}
