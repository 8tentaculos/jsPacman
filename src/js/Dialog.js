import View from 'rasti/View.js';
import makeDot from './factory/makeDot.js';

/**
 * Dialog class that creates a Ms. Pacman style dialog box with a border made of dots.
 * @class Dialog
 * @extends {View}
 */
class Dialog extends View {
    /**
     * Creates an instance of Dialog.
     * @param {Object} options - Configuration options.
     * @param {number} [options.width=400] - Width of the dialog in pixels.
     * @param {number} [options.height=300] - Height of the dialog in pixels.
     * @param {number} [options.x=0] - X coordinate position.
     * @param {number} [options.y=0] - Y coordinate position.
     * @param {string} [options.dotColor='white'] - Color of the dots ('white', 'yellow', 'red').
     * @param {number} [options.borderWidth=8] - Width of the border in pixels (dot size).
     * @param {number} [options.factor=1] - Scaling factor.
     * @param {Scaling} [options.scaling] - Scaling instance for positioning.
     */
    constructor(options = {}) {
        // Initialize as View.
        super(options);

        // Set default values.
        this.width = options.width || 400;
        this.height = options.height || 300;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.factor = options.factor || 1;
        this.z = options.z || 1000;

        this.dotColor = options.dotColor || 'white';
        this.borderWidth = options.borderWidth || 8;
        // Spacing between dot centers = dot size + separation (where separation = dot size).
        // So spacing = borderWidth * 2 (8px dot + 8px gap = 16px total).
        this.dotSpacing = options.dotSpacing || (this.borderWidth * 2);
        this.content = options.content || '';
        this.scaling = options.scaling;

        // Store the previously focused element to restore on hide
        this._previousActiveElement = null;
    }

    /**
     * Renders the dialog with a border made of dots and a black content area.
     */
    render() {
        this.destroyChildren();
        this.dots = [];
        this.el.innerHTML = '';
        // Scale dimensions for rendering.
        const scaledWidth = this.width * this.factor;
        const scaledHeight = this.height * this.factor;
        const scaledBorderWidth = this.borderWidth * this.factor;

        // Set up dialog element styling.
        Object.assign(this.el.style, {
            position : 'absolute',
            overflow : 'visible',
            width : `${scaledWidth}px`,
            height : `${scaledHeight}px`,
            zIndex : this.z,
            transform : `translate(${this.x * this.factor}px, ${this.y * this.factor}px)`
        });

        // Add CSS class to dialog element
        this.el.className = 'dialog';

        // Calculate number of dots needed for each side with spacing.
        // Use Math.floor to ensure we don't exceed bounds, then add one for the corner.
        const dotsHorizontal = Math.floor((this.width - this.borderWidth) / this.dotSpacing) + 1;

        // Create border by rendering individual dot elements with spacing.
        // Top border - always include corners.
        for (let i = 0; i < dotsHorizontal; i++) {
            let x = i * this.dotSpacing;
            // Ensure last dot is at the corner.
            if (i === dotsHorizontal - 1) {
                x = this.width - this.borderWidth;
            }
            const dot = this._createDot(x, 0);
            this.dots.push(dot);
            this.el.appendChild(dot.el);
        }

        // Bottom border - always include corners.
        for (let i = 0; i < dotsHorizontal; i++) {
            let x = i * this.dotSpacing;
            // Ensure last dot is at the corner.
            if (i === dotsHorizontal - 1) {
                x = this.width - this.borderWidth;
            }
            const dot = this._createDot(x, this.height - this.borderWidth);
            this.dots.push(dot);
            this.el.appendChild(dot.el);
        }

        // Left border (excluding corners already drawn in top/bottom).
        // Draw from second dot (y = dotSpacing) to second-to-last (y = height - borderWidth - dotSpacing).
        // Calculate the maximum y position that doesn't overlap with bottom corner.
        const maxY = this.height - this.borderWidth - this.dotSpacing;
        // Draw all dots from second to second-to-last.
        for (let y = this.dotSpacing; y <= maxY; y += this.dotSpacing) {
            const dot = this._createDot(0, y);
            this.dots.push(dot);
            this.el.appendChild(dot.el);
        }

        // Right border (excluding corners already drawn in top/bottom).
        // Draw from second dot (y = dotSpacing) to second-to-last (y = height - borderWidth - dotSpacing).
        // Draw all dots from second to second-to-last.
        for (let y = this.dotSpacing; y <= maxY; y += this.dotSpacing) {
            const dot = this._createDot(this.width - this.borderWidth, y);
            this.dots.push(dot);
            this.el.appendChild(dot.el);
        }

        // Black content area (using scaled border width).
        /**
         * The DOM element for the dialog's content area.
         * This element is created during render() and can be accessed by subclasses
         * to dynamically update the dialog content.
         * @type {HTMLElement}
         * @memberof Dialog
         * @instance
         */
        const contentArea = this.$contentArea = document.createElement('div');
        contentArea.className = 'dialog-content';
        Object.assign(contentArea.style, {
            position : 'absolute',
            top : `${scaledBorderWidth}px`,
            left : `${scaledBorderWidth}px`,
            right : `${scaledBorderWidth}px`,
            bottom : `${scaledBorderWidth}px`,
            backgroundColor : 'transparent',
            overflow : 'hidden',
            padding : '1em',
            boxSizing : 'border-box'
        });

        // Set content if provided.
        if (this.content) {
            contentArea.innerHTML = this.content;
        } else {
            this.renderContent();
        }

        // Append content area.
        this.el.appendChild(contentArea);

        return this;
    }

    /**
     * Creates a single dot element for the border using makeDot.
     * @param {number} x - X position of the dot relative to dialog (in original coordinates).
     * @param {number} y - Y position of the dot relative to dialog (in original coordinates).
     * @returns {Item} The dot Item instance.
     * @private
     */
    _createDot(x, y) {
        // Create dot using makeDot with the same factor as the dialog.
        const dot = makeDot({
            x : x,                  // Position in original coordinates
            y : y,                  // Position in original coordinates
            factor : this.factor,   // Use dialog's factor for scaling
            defaultAnimation : this.dotColor
        });

        // Render the dot to create its DOM element.
        this.addChild(dot.render());

        // Apply transform to position the dot.
        // The transform will use: translate(x * factor - offsetX, y * factor - offsetY)
        dot.transform();

        return dot;
    }

    /**
     * Renders the content of the dialog.
     * This method can be overridden by subclasses to provide custom content rendering.
     * The content should be inserted into `this.$contentArea`.
     * 
     * @example
     * // Example override in a subclass:
     * renderContent() {
     *     this.$contentArea.innerHTML = '<p>Custom content</p>';
     *     return this;
     * }
     * 
     * @returns {Dialog} Returns this instance for method chaining.
     */
    renderContent() {}

    /**
     * Gets all focusable elements within the dialog.
     * @returns {Array<HTMLElement>} Array of focusable elements.
     * @private
     */
    _getFocusableElements() {
        // Selector for focusable elements.
        const focusableSelector = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled]):not([type="hidden"])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        // Get all focusable elements using this.$$
        // Convert NodeList to Array since NodeList doesn't have filter method
        const elements = Array.from(this.$$(focusableSelector));

        // Filter out elements that are not visible or have display:none
        return elements.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   !el.hasAttribute('aria-hidden');
        });
    }

    /**
     * Handles Tab keydown event to trap focus within the dialog.
     * @param {Event} event - The keydown event.
     * @param {View} view - The view instance.
     * @param {HTMLElement} matched - The matched element.
     * @private
     */
    _onKeyDown(event) {
        // Only handle if dialog is visible
        if (this.el.style.display === 'none') {
            return;
        }

        // Only handle Tab key.
        if (event.key !== 'Tab') {
            return;
        }

        const focusableElements = this._getFocusableElements();

        // If no focusable elements, prevent default and return.
        if (focusableElements.length === 0) {
            event.preventDefault();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentElement = document.activeElement;

        // Check if current focus is within the dialog.
        const isCurrentFocusInDialog = this.el.contains(currentElement);

        // If focus is not in dialog, focus first element.
        if (!isCurrentFocusInDialog) {
            event.preventDefault();
            firstElement.focus();
            return;
        }

        // Find the index of the current element in the focusable elements list.
        const currentIndex = focusableElements.indexOf(currentElement);

        // If current element is not in the list (shouldn't happen, but safety check).
        if (currentIndex === -1) {
            event.preventDefault();
            firstElement.focus();
            return;
        }

        // Always prevent default Tab behavior and handle navigation manually
        // This ensures focus never escapes the dialog
        event.preventDefault();
        event.stopPropagation();

        // Handle Tab (forward) and Shift+Tab (backward).
        if (event.shiftKey) {
            // Shift+Tab: move to previous element, wrap to last if on first.
            if (currentIndex === 0) {
                lastElement.focus();
            } else {
                focusableElements[currentIndex - 1].focus();
            }
        } else {
            // Tab: move to next element, wrap to first if on last.
            if (currentIndex === focusableElements.length - 1) {
                firstElement.focus();
            } else {
                focusableElements[currentIndex + 1].focus();
            }
        }
    }

    /**
     * Shows the dialog and focuses the first focusable element.
     */
    show() {
        // Store the currently focused element before showing dialog.
        this._previousActiveElement = document.activeElement;

        this.el.style.display = 'block';

        // Focus the first focusable element after a short delay to ensure DOM is ready.
        // Use double requestAnimationFrame to ensure the dialog is visible and DOM is updated.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const focusableElements = this._getFocusableElements();
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            });
        });
    }

    /**
     * Hides the dialog and optionally restores focus to the previously focused element.
     */
    hide() {
        this.el.style.display = 'none';

        // Restore focus to the previously focused element if it still exists.
        if (this._previousActiveElement) {
            requestAnimationFrame(() => {
                if (document.body.contains(this._previousActiveElement)) this._previousActiveElement.focus();
            });
        }
        this._previousActiveElement = null;
    }
}

/**
 * Event delegation map for Dialog focus trap.
 * Using '*' selector to capture all keydown events within the dialog.
 * This ensures we catch keydown events from any element inside the dialog.
 */
Dialog.prototype.events = {
    'keydown' : '_onKeyDown'
};

export default Dialog;
