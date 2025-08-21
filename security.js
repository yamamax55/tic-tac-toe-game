// Security Enhancement Module for Tic-Tac-Toe Battle
// Provides XSS protection and input sanitization

class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        // Prevent common XSS attack vectors
        this.setupGlobalProtections();
        this.sanitizeExistingContent();
    }

    // Setup global security protections
    setupGlobalProtections() {
        // Prevent eval() usage in production
        if (typeof window !== 'undefined') {
            // Override dangerous functions in production
            window.eval = function() {
                throw new Error('eval() is disabled for security reasons');
            };

            // Prevent Function constructor usage
            const originalFunction = window.Function;
            window.Function = function() {
                throw new Error('Function constructor is disabled for security reasons');
            };

            // Prevent setTimeout/setInterval with string arguments
            const originalSetTimeout = window.setTimeout;
            window.setTimeout = function(callback, delay, ...args) {
                if (typeof callback === 'string') {
                    throw new Error('setTimeout with string argument is disabled for security reasons');
                }
                return originalSetTimeout.call(this, callback, delay, ...args);
            };

            const originalSetInterval = window.setInterval;
            window.setInterval = function(callback, delay, ...args) {
                if (typeof callback === 'string') {
                    throw new Error('setInterval with string argument is disabled for security reasons');
                }
                return originalSetInterval.call(this, callback, delay, ...args);
            };
        }
    }

    // Sanitize HTML content to prevent XSS
    sanitizeHTML(input) {
        if (typeof input !== 'string') {
            return input;
        }

        // Create a temporary div to leverage browser's HTML parsing
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML;
    }

    // Escape special characters for safe HTML insertion
    escapeHTML(text) {
        if (typeof text !== 'string') {
            return text;
        }

        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        return text.replace(/[&<>"'`=\/]/g, function(s) {
            return escapeMap[s];
        });
    }

    // Validate and sanitize user input
    validateInput(input, type = 'text') {
        if (input === null || input === undefined) {
            return '';
        }

        let sanitized = String(input);

        switch (type) {
            case 'playerName':
                // Allow only alphanumeric characters, spaces, and basic punctuation
                sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_]/g, '');
                sanitized = sanitized.substring(0, 20); // Limit length
                break;

            case 'gameMode':
                // Only allow specific game modes
                const allowedModes = ['player', 'cpu'];
                if (!allowedModes.includes(sanitized)) {
                    sanitized = 'player';
                }
                break;

            case 'difficulty':
                // Only allow specific difficulty levels
                const allowedDifficulties = ['easy', 'hard'];
                if (!allowedDifficulties.includes(sanitized)) {
                    sanitized = 'hard';
                }
                break;

            case 'theme':
                // Only allow specific themes
                const allowedThemes = ['default', 'space', 'ocean', 'forest'];
                if (!allowedThemes.includes(sanitized)) {
                    sanitized = 'default';
                }
                break;

            case 'symbol':
                // Only allow O and X
                if (sanitized !== 'O' && sanitized !== 'X') {
                    sanitized = 'O';
                }
                break;

            case 'cellIndex':
                // Validate cell index (0-8 for 3x3 grid)
                const index = parseInt(sanitized);
                if (isNaN(index) || index < 0 || index > 8) {
                    return null;
                }
                return index;

            default:
                // General text sanitization
                sanitized = this.escapeHTML(sanitized);
                sanitized = sanitized.substring(0, 100); // Limit length
        }

        return sanitized;
    }

    // Sanitize existing DOM content
    sanitizeExistingContent() {
        // Find all elements that might contain user-generated content
        const userContentElements = document.querySelectorAll('[data-user-content]');
        
        userContentElements.forEach(element => {
            if (element.textContent) {
                element.textContent = this.escapeHTML(element.textContent);
            }
        });
    }

    // Safe DOM manipulation methods
    safeSetTextContent(element, text) {
        if (!element || typeof text !== 'string') {
            return false;
        }
        
        element.textContent = this.escapeHTML(text);
        return true;
    }

    safeSetInnerHTML(element, html) {
        if (!element || typeof html !== 'string') {
            return false;
        }

        // Use DOMPurify if available, otherwise use basic sanitization
        if (typeof DOMPurify !== 'undefined') {
            element.innerHTML = DOMPurify.sanitize(html);
        } else {
            // Basic sanitization - only allow specific safe tags
            const allowedTags = ['span', 'div', 'p', 'strong', 'em'];
            const sanitizedHTML = this.sanitizeHTML(html);
            element.innerHTML = sanitizedHTML;
        }
        
        return true;
    }

    // Validate localStorage data
    validateStorageData(data) {
        if (!data || typeof data !== 'object') {
            return null;
        }

        const validated = {};

        // Validate theme settings
        if (data.darkMode !== undefined) {
            validated.darkMode = Boolean(data.darkMode);
        }

        if (data.colorBlindMode !== undefined) {
            validated.colorBlindMode = Boolean(data.colorBlindMode);
        }

        if (data.backgroundTheme !== undefined) {
            validated.backgroundTheme = this.validateInput(data.backgroundTheme, 'theme');
        }

        // Validate audio settings
        if (data.bgmEnabled !== undefined) {
            validated.bgmEnabled = Boolean(data.bgmEnabled);
        }

        if (data.sfxEnabled !== undefined) {
            validated.sfxEnabled = Boolean(data.sfxEnabled);
        }

        if (data.voiceEnabled !== undefined) {
            validated.voiceEnabled = Boolean(data.voiceEnabled);
        }

        return validated;
    }

    // Check for potential security threats in URLs
    isValidURL(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        try {
            const urlObj = new URL(url);
            
            // Only allow specific protocols
            const allowedProtocols = ['http:', 'https:', 'data:'];
            if (!allowedProtocols.includes(urlObj.protocol)) {
                return false;
            }

            // Block suspicious patterns
            const suspiciousPatterns = [
                /javascript:/i,
                /vbscript:/i,
                /data:text\/html/i,
                /data:application\/javascript/i
            ];

            return !suspiciousPatterns.some(pattern => pattern.test(url));
        } catch (e) {
            return false;
        }
    }

    // Log security events (for development/debugging)
    logSecurityEvent(event, details = '') {
        if (typeof console !== 'undefined' && console.warn) {
            console.warn(`[SECURITY] ${event}: ${details}`);
        }
    }

    // Rate limiting for API calls
    createRateLimiter(maxCalls = 10, timeWindow = 60000) {
        const calls = [];
        
        return function() {
            const now = Date.now();
            
            // Remove old calls outside the time window
            while (calls.length > 0 && calls[0] < now - timeWindow) {
                calls.shift();
            }
            
            // Check if we've exceeded the limit
            if (calls.length >= maxCalls) {
                throw new Error('Rate limit exceeded');
            }
            
            calls.push(now);
            return true;
        };
    }
}

// Global security instance
window.securityManager = new SecurityManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}