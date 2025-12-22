import View from 'rasti/View.js';

/**
 * Event name for gamepad connected events.
 * @constant {string}
 */
export const EVENT_GAMEPAD_CONNECTED = 'gamepad:connected';
/**
 * Event name for gamepad disconnected events.
 * @constant {string}
 */
export const EVENT_GAMEPAD_DISCONNECTED = 'gamepad:disconnected';
/**
 * Event name for gamepad start button press.
 * @constant {string}
 */
export const EVENT_GAMEPAD_START = 'gamepad:start';

/**
 * Direction constant for up.
 * @constant {string}
 */
export const DIRECTION_UP = 'u';
/**
 * Direction constant for right.
 * @constant {string}
 */
export const DIRECTION_RIGHT = 'r';
/**
 * Direction constant for down.
 * @constant {string}
 */
export const DIRECTION_DOWN = 'd';
/**
 * Direction constant for left.
 * @constant {string}
 */
export const DIRECTION_LEFT = 'l';

/**
 * Default properties for Gamepad instances.
 * @type {Object}
 */
const defaults = {
    deadZone : 0.3 // Minimum axis value to be considered a direction input
};

/**
 * Gamepad event handler class for managing gamepad input.
 * Extends View from rasti framework.
 * @class Gamepad
 * @extends {View}
 */
class Gamepad extends View {
    /**
     * Creates an instance of Gamepad.
     * @param {Object} [options={}] - Configuration options.
     * @param {number} [options.deadZone=0.3] - Minimum axis value to be considered a direction input (0-1).
     */
    constructor(options = {}) {
        super({
            ...options,
            el : options.el || (document && document.body)
        });

        Object.keys(defaults).forEach((key) => {
            if (key in options) this[key] = options[key];
        });

        this.directions = {
            [DIRECTION_UP] : false,
            [DIRECTION_RIGHT] : false,
            [DIRECTION_DOWN] : false,
            [DIRECTION_LEFT] : false
        };

        this.gamepads = [];
        this._lastStartButtonState = false;

        this.onGamepadConnected = this.onGamepadConnected.bind(this);
        this.onGamepadDisconnected = this.onGamepadDisconnected.bind(this);

        // Listen for gamepad connection events
        window.addEventListener('gamepadconnected', this.onGamepadConnected);
        window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);

        // Update gamepad list if gamepads are already connected
        this.updateGamepadList();
    }

    /**
     * Cleanup method called when the Gamepad instance is destroyed.
     * Removes event listeners.
     */
    onDestroy() {
        window.removeEventListener('gamepadconnected', this.onGamepadConnected);
        window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    }

    /**
     * Handles gamepad connected events.
     * @param {GamepadEvent} event - The gamepad event.
     */
    onGamepadConnected(event) {
        this.updateGamepadList();
        this.emit(EVENT_GAMEPAD_CONNECTED, event.gamepad);
    }

    /**
     * Handles gamepad disconnected events.
     * @param {GamepadEvent} event - The gamepad event.
     */
    onGamepadDisconnected(event) {
        this.updateGamepadList();
        this.emit(EVENT_GAMEPAD_DISCONNECTED, event.gamepad);
        if (this.gamepads.length === 0) {
            this.clear();
        }
    }

    /**
     * Updates the list of connected gamepads.
     */
    updateGamepadList() {
        const gamepadList = navigator.getGamepads ? navigator.getGamepads() : [];
        this.gamepads = Array.from(gamepadList).filter(gp => gp !== null);
    }

    /**
     * Refreshes gamepad state. Called from the game loop.
     * Polls all connected gamepads and updates direction state.
     * Reads from the first connected gamepad.
     */
    refresh() {
        this.updateGamepadList();

        if (this.gamepads.length === 0) {
            this.clear();
            return;
        }

        // Use the first connected gamepad
        const gamepad = this.gamepads[0];
        if (!gamepad) return;

        // Read D-pad buttons
        // Standard mapping: buttons 12-15 for D-pad
        // But some gamepads use different mappings
        // Check multiple possible button indices
        const dpadUp = gamepad.buttons[12]?.pressed || 
                       gamepad.buttons[0]?.pressed || false;
        const dpadDown = gamepad.buttons[13]?.pressed || 
                         gamepad.buttons[1]?.pressed || false;
        const dpadLeft = gamepad.buttons[14]?.pressed || 
                         gamepad.buttons[2]?.pressed || false;
        const dpadRight = gamepad.buttons[15]?.pressed || 
                          gamepad.buttons[3]?.pressed || false;

        // Read all available axes to find the correct mapping
        // Standard: axes[0] = horizontal, axes[1] = vertical
        // But we know axis 1 works for horizontal, so we need to find which axis is vertical
        const axis0 = gamepad.axes[0] || 0;
        const axis1 = gamepad.axes[1] || 0;
        const axis2 = gamepad.axes[2] || 0;
        const axis3 = gamepad.axes[3] || 0;

        // We know axis1 works for horizontal (left/right)
        const leftStickX = axis1; // Horizontal from axis 1
        
        // Try axis2 as vertical since axis1 is horizontal
        // Some gamepads have non-standard axis mappings
        // Since axis1 works for horizontal, try axis2 for vertical
        // If axis2 doesn't exist, fallback to axis0
        const leftStickY = gamepad.axes.length > 2 ? axis2 : axis0;

        // Determine direction from D-pad first
        let direction = null;
        if (dpadUp) {
            direction = DIRECTION_UP;
        } else if (dpadDown) {
            direction = DIRECTION_DOWN;
        } else if (dpadLeft) {
            direction = DIRECTION_LEFT;
        } else if (dpadRight) {
            direction = DIRECTION_RIGHT;
        }

        // If no D-pad input, check left stick
        if (!direction) {
            const absX = Math.abs(leftStickX);
            const absY = Math.abs(leftStickY);

            // Check if either axis exceeds dead zone
            const xActive = absX > this.deadZone;
            const yActive = absY > this.deadZone;

            if (xActive || yActive) {
                // If both are active, use the stronger one
                // If only one is active, use that one
                if (yActive && (!xActive || absY >= absX)) {
                    // Vertical movement detected
                    // Standard: leftStickY < 0 means up, > 0 means down
                    if (leftStickY < 0) {
                        direction = DIRECTION_UP;
                    } else if (leftStickY > 0) {
                        direction = DIRECTION_DOWN;
                    }
                } else if (xActive) {
                    // Horizontal movement is stronger or only horizontal is active
                    // leftStickX < 0 means left, > 0 means right (this works)
                    direction = leftStickX < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
                }
            }
        }

        // Update direction states
        this.directions[DIRECTION_UP] = direction === DIRECTION_UP;
        this.directions[DIRECTION_RIGHT] = direction === DIRECTION_RIGHT;
        this.directions[DIRECTION_DOWN] = direction === DIRECTION_DOWN;
        this.directions[DIRECTION_LEFT] = direction === DIRECTION_LEFT;

        // Check for Start button (typically button 9, but some gamepads use different indices)
        const startButton = gamepad.buttons[9]?.pressed || 
                           gamepad.buttons[8]?.pressed || 
                           gamepad.buttons[7]?.pressed || false;
        
        // Emit event only on button press (not while held)
        if (startButton && !this._lastStartButtonState) {
            this.emit(EVENT_GAMEPAD_START);
        }
        this._lastStartButtonState = startButton;
    }

    /**
     * Clears all tracked direction states.
     */
    clear() {
        this.directions = {
            [DIRECTION_UP] : false,
            [DIRECTION_RIGHT] : false,
            [DIRECTION_DOWN] : false,
            [DIRECTION_LEFT] : false
        };
        this._lastStartButtonState = false;
    }

    /**
     * Gets the current direction state.
     * @returns {string|null} The current direction ('u', 'r', 'd', 'l') or null.
     */
    getDirection() {
        if (this.directions[DIRECTION_UP]) return DIRECTION_UP;
        if (this.directions[DIRECTION_RIGHT]) return DIRECTION_RIGHT;
        if (this.directions[DIRECTION_DOWN]) return DIRECTION_DOWN;
        if (this.directions[DIRECTION_LEFT]) return DIRECTION_LEFT;
        return null;
    }
}

Object.assign(Gamepad.prototype, defaults);

export default Gamepad;
