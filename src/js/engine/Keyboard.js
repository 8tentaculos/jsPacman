import View from 'rasti/View.js';

/**
 * Key code constant for the Up arrow key.
 * @constant {number}
 */
export const KEY_UP = 38;
/**
 * Key code constant for the Right arrow key.
 * @constant {number}
 */
export const KEY_RIGHT = 39;
/**
 * Key code constant for the Down arrow key.
 * @constant {number}
 */
export const KEY_DOWN = 40;
/**
 * Key code constant for the Left arrow key.
 * @constant {number}
 */
export const KEY_LEFT = 37;

/**
 * Event name for key up events.
 * @constant {string}
 */
export const EVENT_KEY_UP = 'keyup';
/**
 * Event name for key down events.
 * @constant {string}
 */
export const EVENT_KEY_DOWN = 'keydown';

/**
 * Keyboard event handler class for managing keyboard input.
 * Extends View from rasti framework.
 * @class Keyboard
 * @extends {View}
 */
class Keyboard extends View {
    /**
     * Creates an instance of Keyboard.
     * @param {Object} [options] - Configuration options.
     * @param {HTMLElement} [options.el] - Element to attach keyboard listeners to. Defaults to document.body.
     */
    constructor(options) {
        super({
            el : document && document.body,
            ...options
        });

        this.keys = {};
    }

    /**
     * Handles key up events and updates the keys state.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    onKeyUp(event) {
        this.keys[event.keyCode] = false;
        this.emit(EVENT_KEY_UP, event);
    }

    /**
     * Handles key down events and updates the keys state.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    onKeyDown(event) {
        this.keys[event.keyCode] = true;
        this.emit(EVENT_KEY_DOWN, event);
    }

    /**
     * Clears all tracked key states.
     */
    clear() {
        this.keys = {};
    }
}

Keyboard.prototype.events = {
    keyup : 'onKeyUp',
    keydown : 'onKeyDown'
};

export default Keyboard;
