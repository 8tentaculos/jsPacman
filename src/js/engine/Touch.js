import { View } from 'rasti';

/**
 * Event name for swipe gestures.
 * @constant {string}
 */
export const EVENT_SWIPE = 'swipe';

/**
 * Event name for upward swipe gestures.
 * @constant {string}
 */
export const EVENT_SWIPE_UP = 'swipe:up';
/**
 * Event name for rightward swipe gestures.
 * @constant {string}
 */
export const EVENT_SWIPE_RIGHT = 'swipe:right';
/**
 * Event name for downward swipe gestures.
 * @constant {string}
 */
export const EVENT_SWIPE_DOWN = 'swipe:down';
/**
 * Event name for leftward swipe gestures.
 * @constant {string}
 */
export const EVENT_SWIPE_LEFT = 'swipe:left';

/**
 * Default properties for Touch instances.
 * @type {Object}
 */
const defaults = {
    threshold : 100, // required min distance traveled to be considered swipe
    restraint : 150, // maximum distance allowed at the same time in perpendicular direction
    allowedTime : 400 // maximum time allowed to travel that distance
};

/**
 * Touch event handler class for detecting swipe gestures on touch devices.
 * Extends View from rasti framework.
 * @class Touch
 * @extends {View}
 */
class Touch extends View {
    /**
     * Creates an instance of Touch.
     * @param {Object} [options={}] - Configuration options.
     * @param {HTMLElement} [options.el] - Element to attach touch listeners to. Defaults to document.body.
     * @param {number} [options.threshold=100] - Required minimum distance traveled to be considered a swipe (in pixels).
     * @param {number} [options.restraint=150] - Maximum distance allowed at the same time in perpendicular direction (in pixels).
     * @param {number} [options.allowedTime=400] - Maximum time allowed to travel that distance (in milliseconds).
     */
    constructor(options = {}) {
        super({
            ...options,
            el : options.el || (document && document.body)
        });

        Object.keys(defaults).forEach((key) => {
            if (key in options) this[key] = options[key];
        });

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        this.el.addEventListener('touchstart', this.onTouchStart, false);
        this.el.addEventListener('touchend', this.onTouchEnd, false);
    }

    /**
     * Cleanup method called when the Touch instance is destroyed.
     * Removes touch event listeners.
     */
    onDestroy() {
        this.el.removeEventListener('touchstart', this.onTouchStart);
        this.el.removeEventListener('touchend', this.onTouchEnd);
    }

    /**
     * Handles touch start events to record the initial touch position and time.
     * @param {TouchEvent} event - The touch event.
     */
    onTouchStart(event) {
        const touch = event.changedTouches[0];

        this.startX = touch.pageX;
        this.startY = touch.pageY;
        this.startTime = new Date(); // record time when finger first makes contact with surface
    }

    /**
     * Handles touch end events to detect swipe gestures and emit appropriate events.
     * @param {TouchEvent} event - The touch event.
     */
    onTouchEnd(event) {
        let type = null;

        const touch = event.changedTouches[0];

        const distX = touch.pageX - this.startX; // get horizontal dist traveled by finger while in contact with surface
        const distY = touch.pageY - this.startY; // get vertical dist traveled by finger while in contact with surface
        const elapsedTime = new Date() - this.startTime; // get time elapsed

        if (elapsedTime <= this.allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint) { // 2nd condition for horizontal swipe met
                type = (distX < 0) ? EVENT_SWIPE_LEFT : EVENT_SWIPE_RIGHT; // if dist traveled is negative, it indicates left swipe
            }

            else if (Math.abs(distY) >= this.threshold && Math.abs(distX) <= this.restraint) { // 2nd condition for vertical swipe met
                type = (distY < 0) ? EVENT_SWIPE_UP : EVENT_SWIPE_DOWN; // if dist traveled is negative, it indicates up swipe
            }

            this.emit(EVENT_SWIPE, type, event);
        }
    }
}

Object.assign(Touch.prototype, defaults);

export default Touch;
